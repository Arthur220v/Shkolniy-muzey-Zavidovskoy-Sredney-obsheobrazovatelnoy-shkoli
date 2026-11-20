create table public.museum_news (
  id uuid primary key default gen_random_uuid(),
  body text not null
    check (body = btrim(body) and char_length(body) between 1 and 6000),
  moderator_user_id uuid references public.guestbook_moderators (user_id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  check (
    (status = 'draft' and published_at is null)
    or (status in ('published', 'archived') and published_at is not null)
  )
);

create index museum_news_status_published_at_idx
  on public.museum_news (status, published_at desc);

alter table public.museum_news enable row level security;
grant select on public.museum_news to anon, authenticated;
grant insert, update, delete on public.museum_news to authenticated;

create policy "Visitors can read published museum news"
  on public.museum_news
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Moderators can read all museum news"
  on public.museum_news
  for select
  to authenticated
  using (public.is_guestbook_moderator());

create policy "Moderators can create museum news drafts"
  on public.museum_news
  for insert
  to authenticated
  with check (
    public.is_guestbook_moderator()
    and moderator_user_id = (select auth.uid())
    and status = 'draft'
    and published_at is null
  );

create policy "Moderators can update museum news"
  on public.museum_news
  for update
  to authenticated
  using (public.is_guestbook_moderator())
  with check (public.is_guestbook_moderator());

create policy "Moderators can delete museum news"
  on public.museum_news
  for delete
  to authenticated
  using (public.is_guestbook_moderator());

create table public.museum_news_photos (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.museum_news (id) on delete cascade,
  storage_path text not null unique,
  sort_order smallint not null check (sort_order between 0 and 5),
  created_at timestamptz not null default now(),
  unique (news_id, sort_order),
  check (storage_path like news_id::text || '/%')
);

create index museum_news_photos_news_order_idx
  on public.museum_news_photos (news_id, sort_order);

alter table public.museum_news_photos enable row level security;
grant select on public.museum_news_photos to anon, authenticated;
grant insert, delete on public.museum_news_photos to authenticated;

create policy "Visitors can read photos of published museum news"
  on public.museum_news_photos
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.museum_news
      where museum_news.id = museum_news_photos.news_id
        and museum_news.status = 'published'
    )
  );

create policy "Moderators can read all museum news photos"
  on public.museum_news_photos
  for select
  to authenticated
  using (public.is_guestbook_moderator());

create policy "Moderators can add museum news photos"
  on public.museum_news_photos
  for insert
  to authenticated
  with check (
    public.is_guestbook_moderator()
    and exists (
      select 1
      from public.museum_news
      where museum_news.id = museum_news_photos.news_id
        and museum_news.status = 'draft'
    )
  );

create policy "Moderators can delete museum news photos"
  on public.museum_news_photos
  for delete
  to authenticated
  using (public.is_guestbook_moderator());

create table public.museum_news_reactions (
  news_id uuid not null references public.museum_news (id) on delete cascade,
  voter_id uuid not null,
  reaction text not null check (reaction in ('heart', 'surprised', 'dove')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (news_id, voter_id)
);

create index museum_news_reactions_news_idx
  on public.museum_news_reactions (news_id);

alter table public.museum_news_reactions enable row level security;
revoke all on public.museum_news_reactions from anon, authenticated;

create or replace view public.museum_news_reaction_counts as
select
  reaction.news_id,
  count(*) filter (where reaction.reaction = 'heart')::integer as hearts,
  count(*) filter (where reaction.reaction = 'surprised')::integer as surprised,
  count(*) filter (where reaction.reaction = 'dove')::integer as doves
from public.museum_news_reactions as reaction
join public.museum_news as news on news.id = reaction.news_id
where news.status = 'published'
group by reaction.news_id;

grant select on public.museum_news_reaction_counts to anon, authenticated;

create or replace function public.set_museum_news_reaction(
  p_news_id uuid,
  p_voter_id uuid,
  p_reaction text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_voter_id is null then
    raise exception 'A voter identifier is required.';
  end if;

  if p_reaction is not null and p_reaction not in ('heart', 'surprised', 'dove') then
    raise exception 'Unsupported museum news reaction.';
  end if;

  if not exists (
    select 1
    from public.museum_news
    where id = p_news_id
      and status = 'published'
  ) then
    raise exception 'The museum news item is not published.';
  end if;

  if p_reaction is null then
    delete from public.museum_news_reactions
    where news_id = p_news_id
      and voter_id = p_voter_id;
  else
    insert into public.museum_news_reactions (news_id, voter_id, reaction)
    values (p_news_id, p_voter_id, p_reaction)
    on conflict (news_id, voter_id)
    do update
      set reaction = excluded.reaction,
          updated_at = now();
  end if;
end
$$;

revoke all on function public.set_museum_news_reaction(uuid, uuid, text) from public;
grant execute on function public.set_museum_news_reaction(uuid, uuid, text) to anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'museum-news',
  'museum-news',
  false,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Visitors can read published museum news images"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'museum-news'
    and exists (
      select 1
      from public.museum_news_photos as photo
      join public.museum_news as news on news.id = photo.news_id
      where photo.storage_path = storage.objects.name
        and news.status = 'published'
    )
  );

create policy "Moderators can read all museum news images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'museum-news'
    and public.is_guestbook_moderator()
  );

create policy "Moderators can upload museum news images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'museum-news'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp)$'
    and exists (
      select 1
      from public.museum_news
      where museum_news.id::text = split_part(name, '/', 1)
        and museum_news.status = 'draft'
        and public.is_guestbook_moderator()
    )
  );

create policy "Moderators can delete museum news images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'museum-news'
    and public.is_guestbook_moderator()
  );
