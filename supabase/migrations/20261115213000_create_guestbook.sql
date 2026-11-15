create table public.guestbook_moderators (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.guestbook_reviews (
  id uuid primary key default gen_random_uuid(),
  first_name text not null
    check (first_name = btrim(first_name) and char_length(first_name) between 2 and 40),
  last_name text not null
    check (last_name = btrim(last_name) and char_length(last_name) between 2 and 40),
  body text not null
    check (body = btrim(body) and char_length(body) between 10 and 1200),
  avatar_emoji text not null
    check (avatar_emoji in ('📚', '⭐', '🕊️', '🌿', '🦉', '🏛️')),
  avatar_color text not null
    check (avatar_color in ('blue', 'gold', 'green', 'burgundy', 'violet')),
  consent boolean not null default false check (consent),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index guestbook_reviews_status_created_at_idx
  on public.guestbook_reviews (status, created_at desc);

alter table public.guestbook_moderators enable row level security;
alter table public.guestbook_reviews enable row level security;

create or replace function public.is_guestbook_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.guestbook_moderators
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_guestbook_moderator() from public;
grant execute on function public.is_guestbook_moderator() to authenticated;

grant select, insert on public.guestbook_reviews to anon, authenticated;
grant update, delete on public.guestbook_reviews to authenticated;
revoke all on public.guestbook_moderators from anon, authenticated;

create policy "Anyone can read approved guestbook reviews"
  on public.guestbook_reviews
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "Moderators can read all guestbook reviews"
  on public.guestbook_reviews
  for select
  to authenticated
  using (public.is_guestbook_moderator());

create policy "Visitors can submit reviews for moderation"
  on public.guestbook_reviews
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "Moderators can update guestbook reviews"
  on public.guestbook_reviews
  for update
  to authenticated
  using (public.is_guestbook_moderator())
  with check (public.is_guestbook_moderator());

create policy "Moderators can delete guestbook reviews"
  on public.guestbook_reviews
  for delete
  to authenticated
  using (public.is_guestbook_moderator());
