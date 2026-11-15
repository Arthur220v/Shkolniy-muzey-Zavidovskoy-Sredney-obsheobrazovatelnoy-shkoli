alter table public.guestbook_reviews
  add column avatar_image_path text,
  add column avatar_image_status text not null default 'none'
    check (avatar_image_status in ('none', 'pending', 'approved', 'rejected')),
  add constraint guestbook_reviews_avatar_image_consistency_check
    check (
      (avatar_image_path is null and avatar_image_status = 'none')
      or (
        avatar_image_path is not null
        and avatar_image_path like id::text || '/%'
        and avatar_image_status <> 'none'
      )
    );

create unique index guestbook_moderators_single_account_idx
  on public.guestbook_moderators ((true));

drop policy "Visitors can submit reviews for moderation"
  on public.guestbook_reviews;

create policy "Visitors can submit reviews for moderation"
  on public.guestbook_reviews
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and avatar_image_path is null
    and avatar_image_status in ('none', 'pending')
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'guestbook-avatars',
  'guestbook-avatars',
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

create or replace function public.can_upload_guestbook_avatar(review_id_text text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.guestbook_reviews as review
    where review.id::text = review_id_text
      and review.status = 'pending'
      and review.avatar_image_path is null
      and review.consent
      and not exists (
        select 1
        from storage.objects as avatar
        where avatar.bucket_id = 'guestbook-avatars'
          and split_part(avatar.name, '/', 1) = review.id::text
      )
  );
$$;

create or replace function public.can_remove_unattached_guestbook_avatar(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.guestbook_reviews as review
    where review.id::text = split_part(object_name, '/', 1)
      and review.status = 'pending'
      and review.avatar_image_path is null
  );
$$;

revoke all on function public.can_upload_guestbook_avatar(text) from public;
revoke all on function public.can_remove_unattached_guestbook_avatar(text) from public;
grant execute on function public.can_upload_guestbook_avatar(text) to anon, authenticated;
grant execute on function public.can_remove_unattached_guestbook_avatar(text) to anon, authenticated;

create policy "Visitors can upload guestbook avatars"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'guestbook-avatars'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp)$'
    and public.can_upload_guestbook_avatar(split_part(name, '/', 1))
  );

create policy "Visitors can remove unattached guestbook avatars"
  on storage.objects
  for delete
  to anon, authenticated
  using (
    bucket_id = 'guestbook-avatars'
    and public.can_remove_unattached_guestbook_avatar(name)
  );

create policy "Visitors can read approved guestbook avatars"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'guestbook-avatars'
    and exists (
      select 1
      from public.guestbook_reviews as review
      where review.avatar_image_path = storage.objects.name
        and review.status = 'approved'
        and review.avatar_image_status = 'approved'
    )
  );

create policy "Moderators can read guestbook avatars"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'guestbook-avatars'
    and public.is_guestbook_moderator()
  );

create policy "Moderators can delete guestbook avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'guestbook-avatars'
    and public.is_guestbook_moderator()
  );

create or replace function public.attach_guestbook_avatar(
  p_review_id uuid,
  p_avatar_path text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_avatar_path !~* (
    '^' || p_review_id::text
    || '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp)$'
  ) then
    raise exception 'Invalid guestbook avatar path.';
  end if;

  if not exists (
    select 1
    from storage.objects
    where bucket_id = 'guestbook-avatars'
      and name = p_avatar_path
  ) then
    raise exception 'Guestbook avatar file does not exist.';
  end if;

  update public.guestbook_reviews
  set
    avatar_image_path = p_avatar_path,
    avatar_image_status = 'pending'
  where id = p_review_id
    and status = 'pending'
    and avatar_image_path is null
    and consent;

  if not found then
    raise exception 'Review is not available for avatar upload.';
  end if;
end
$$;

revoke all on function public.attach_guestbook_avatar(uuid, text) from public;
grant execute on function public.attach_guestbook_avatar(uuid, text) to anon, authenticated;

create table public.guestbook_moderation_history (
  id bigint generated always as identity primary key,
  review_id uuid not null,
  reviewer_first_name text not null,
  reviewer_last_name text not null,
  review_body text not null,
  action text not null check (
    action in (
      'review_submitted',
      'review_approved',
      'review_rejected',
      'review_reopened',
      'review_deleted',
      'avatar_approved',
      'avatar_rejected',
      'avatar_reset',
      'avatar_submitted'
    )
  ),
  previous_value text,
  new_value text,
  avatar_image_status text not null,
  moderator_user_id uuid references auth.users (id) on delete set null,
  moderator_email text,
  created_at timestamptz not null default now()
);

create index guestbook_moderation_history_created_at_idx
  on public.guestbook_moderation_history (created_at desc);

alter table public.guestbook_moderation_history enable row level security;

revoke all on public.guestbook_moderation_history from anon, authenticated;
grant select on public.guestbook_moderation_history to authenticated;

create policy "Only moderators can read guestbook history"
  on public.guestbook_moderation_history
  for select
  to authenticated
  using (public.is_guestbook_moderator());

create or replace function public.log_guestbook_moderation_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_email text;
  event_action text;
begin
  if actor_id is not null then
    if public.is_guestbook_moderator() then
      select user_record.email
      into actor_email
      from auth.users as user_record
      where user_record.id = actor_id;
    else
      actor_id := null;
    end if;
  end if;

  if tg_op = 'INSERT' then
    insert into public.guestbook_moderation_history (
      review_id,
      reviewer_first_name,
      reviewer_last_name,
      review_body,
      action,
      new_value,
      avatar_image_status,
      moderator_user_id,
      moderator_email
    )
    values (
      new.id,
      new.first_name,
      new.last_name,
      new.body,
      'review_submitted',
      new.status,
      new.avatar_image_status,
      actor_id,
      actor_email
    );
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      event_action := case new.status
        when 'approved' then 'review_approved'
        when 'rejected' then 'review_rejected'
        else 'review_reopened'
      end;

      insert into public.guestbook_moderation_history (
        review_id,
        reviewer_first_name,
        reviewer_last_name,
        review_body,
        action,
        previous_value,
        new_value,
        avatar_image_status,
        moderator_user_id,
        moderator_email
      )
      values (
        new.id,
        new.first_name,
        new.last_name,
        new.body,
        event_action,
        old.status,
        new.status,
        new.avatar_image_status,
        actor_id,
        actor_email
      );
    end if;

    if new.avatar_image_status is distinct from old.avatar_image_status then
      event_action := case new.avatar_image_status
        when 'approved' then 'avatar_approved'
        when 'rejected' then 'avatar_rejected'
        when 'pending' then 'avatar_submitted'
        else 'avatar_reset'
      end;

      insert into public.guestbook_moderation_history (
        review_id,
        reviewer_first_name,
        reviewer_last_name,
        review_body,
        action,
        previous_value,
        new_value,
        avatar_image_status,
        moderator_user_id,
        moderator_email
      )
      values (
        new.id,
        new.first_name,
        new.last_name,
        new.body,
        event_action,
        old.avatar_image_status,
        new.avatar_image_status,
        new.avatar_image_status,
        actor_id,
        actor_email
      );
    end if;
    return new;
  end if;

  insert into public.guestbook_moderation_history (
    review_id,
    reviewer_first_name,
    reviewer_last_name,
    review_body,
    action,
    previous_value,
    avatar_image_status,
    moderator_user_id,
    moderator_email
  )
  values (
    old.id,
    old.first_name,
    old.last_name,
    old.body,
    'review_deleted',
    old.status,
    old.avatar_image_status,
    actor_id,
    actor_email
  );
  return old;
end
$$;

revoke all on function public.log_guestbook_moderation_event() from public, anon, authenticated;

create trigger guestbook_review_moderation_history
  after insert or update or delete on public.guestbook_reviews
  for each row
  execute function public.log_guestbook_moderation_event();
