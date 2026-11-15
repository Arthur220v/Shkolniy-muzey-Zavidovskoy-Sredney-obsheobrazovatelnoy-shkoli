alter table public.guestbook_reviews
  add column rating smallint;

update public.guestbook_reviews
set rating = 5
where rating is null;

alter table public.guestbook_reviews
  alter column rating set default 5,
  alter column rating set not null,
  add constraint guestbook_reviews_rating_check
    check (rating between 1 and 5),
  add column moderator_reply text,
  add column moderator_replied_at timestamptz,
  add constraint guestbook_reviews_moderator_reply_length_check
    check (
      moderator_reply is null
      or (
        moderator_reply = btrim(moderator_reply)
        and char_length(moderator_reply) between 1 and 1200
      )
    ),
  add constraint guestbook_reviews_moderator_reply_time_check
    check (
      (moderator_reply is null and moderator_replied_at is null)
      or (moderator_reply is not null and moderator_replied_at is not null)
    );

alter table public.guestbook_moderators
  add column profile_first_name text,
  add column profile_last_name text,
  add column profile_image_path text,
  add constraint guestbook_moderators_profile_name_check
    check (
      (profile_first_name is null and profile_last_name is null)
      or (
        profile_first_name is not null
        and profile_last_name is not null
        and profile_first_name = btrim(profile_first_name)
        and profile_last_name = btrim(profile_last_name)
        and char_length(profile_first_name) between 2 and 40
        and char_length(profile_last_name) between 2 and 40
      )
    ),
  add constraint guestbook_moderators_profile_image_path_check
    check (
      profile_image_path is null
      or profile_image_path ~* '^profiles/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp)$'
    );

grant select (user_id, profile_first_name, profile_last_name, profile_image_path)
  on public.guestbook_moderators to authenticated;
grant update (profile_first_name, profile_last_name, profile_image_path)
  on public.guestbook_moderators to authenticated;

create policy "Moderators can read their profile"
  on public.guestbook_moderators
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and public.is_guestbook_moderator()
  );

create policy "Moderators can update their profile"
  on public.guestbook_moderators
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    and public.is_guestbook_moderator()
  )
  with check (
    user_id = (select auth.uid())
    and public.is_guestbook_moderator()
  );

create or replace view public.guestbook_moderator_profile as
select profile_first_name, profile_last_name, profile_image_path
from public.guestbook_moderators
limit 1;

grant select on public.guestbook_moderator_profile to anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'guestbook-moderator-profile',
  'guestbook-moderator-profile',
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

create policy "Visitors can read moderator profile photos"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'guestbook-moderator-profile'
    and exists (
      select 1
      from public.guestbook_moderator_profile as profile
      where profile.profile_image_path = storage.objects.name
    )
  );

create policy "Moderators can read profile photos"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'guestbook-moderator-profile'
    and public.is_guestbook_moderator()
  );

create policy "Moderators can upload profile photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'guestbook-moderator-profile'
    and public.is_guestbook_moderator()
    and name ~* '^profiles/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp)$'
  );

create policy "Moderators can delete profile photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'guestbook-moderator-profile'
    and public.is_guestbook_moderator()
  );

create table public.guestbook_review_votes (
  review_id uuid not null
    references public.guestbook_reviews (id) on delete cascade,
  voter_id uuid not null,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (review_id, voter_id)
);

alter table public.guestbook_review_votes enable row level security;
revoke all on public.guestbook_review_votes from anon, authenticated;

create or replace view public.guestbook_review_vote_counts as
select
  votes.review_id,
  count(*) filter (where votes.vote = 1)::integer as likes,
  count(*) filter (where votes.vote = -1)::integer as dislikes
from public.guestbook_review_votes as votes
join public.guestbook_reviews as review
  on review.id = votes.review_id
where review.status = 'approved'
group by votes.review_id;

grant select on public.guestbook_review_vote_counts to anon, authenticated;

create or replace function public.cast_guestbook_vote(
  p_review_id uuid,
  p_voter_id uuid,
  p_vote smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_vote not in (-1, 0, 1) then
    raise exception 'Vote must be -1, 0, or 1.';
  end if;

  if not exists (
    select 1
    from public.guestbook_reviews as review
    where review.id = p_review_id
      and review.status = 'approved'
  ) then
    raise exception 'Review is not available for voting.';
  end if;

  if p_vote = 0 then
    delete from public.guestbook_review_votes
    where review_id = p_review_id
      and voter_id = p_voter_id;
  else
    insert into public.guestbook_review_votes (review_id, voter_id, vote)
    values (p_review_id, p_voter_id, p_vote)
    on conflict (review_id, voter_id) do update
    set vote = excluded.vote, updated_at = now();
  end if;
end
$$;

revoke all on function public.cast_guestbook_vote(uuid, uuid, smallint) from public;
grant execute on function public.cast_guestbook_vote(uuid, uuid, smallint) to anon, authenticated;

alter table public.guestbook_moderation_history
  add column rating smallint not null default 5,
  add column moderator_reply_snapshot text;

alter table public.guestbook_moderation_history
  drop constraint if exists guestbook_moderation_history_action_check,
  add constraint guestbook_moderation_history_action_check
    check (
      action in (
        'review_submitted',
        'review_approved',
        'review_rejected',
        'review_reopened',
        'review_deleted',
        'avatar_approved',
        'avatar_rejected',
        'avatar_reset',
        'avatar_submitted',
        'moderator_replied',
        'moderator_reply_updated',
        'moderator_reply_deleted'
      )
    );

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
      rating,
      action,
      new_value,
      avatar_image_status,
      moderator_reply_snapshot,
      moderator_user_id,
      moderator_email
    )
    values (
      new.id,
      new.first_name,
      new.last_name,
      new.body,
      new.rating,
      'review_submitted',
      new.status,
      new.avatar_image_status,
      new.moderator_reply,
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
        rating,
        action,
        previous_value,
        new_value,
        avatar_image_status,
        moderator_reply_snapshot,
        moderator_user_id,
        moderator_email
      )
      values (
        new.id,
        new.first_name,
        new.last_name,
        new.body,
        new.rating,
        event_action,
        old.status,
        new.status,
        new.avatar_image_status,
        new.moderator_reply,
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
        rating,
        action,
        previous_value,
        new_value,
        avatar_image_status,
        moderator_reply_snapshot,
        moderator_user_id,
        moderator_email
      )
      values (
        new.id,
        new.first_name,
        new.last_name,
        new.body,
        new.rating,
        event_action,
        old.avatar_image_status,
        new.avatar_image_status,
        new.avatar_image_status,
        new.moderator_reply,
        actor_id,
        actor_email
      );
    end if;

    if new.moderator_reply is distinct from old.moderator_reply then
      event_action := case
        when new.moderator_reply is null then 'moderator_reply_deleted'
        when old.moderator_reply is null then 'moderator_replied'
        else 'moderator_reply_updated'
      end;

      insert into public.guestbook_moderation_history (
        review_id,
        reviewer_first_name,
        reviewer_last_name,
        review_body,
        rating,
        action,
        avatar_image_status,
        moderator_reply_snapshot,
        moderator_user_id,
        moderator_email
      )
      values (
        new.id,
        new.first_name,
        new.last_name,
        new.body,
        new.rating,
        event_action,
        new.avatar_image_status,
        coalesce(new.moderator_reply, old.moderator_reply),
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
    rating,
    action,
    previous_value,
    avatar_image_status,
    moderator_reply_snapshot,
    moderator_user_id,
    moderator_email
  )
  values (
    old.id,
    old.first_name,
    old.last_name,
    old.body,
    old.rating,
    'review_deleted',
    old.status,
    old.avatar_image_status,
    old.moderator_reply,
    actor_id,
    actor_email
  );
  return old;
end
$$;
