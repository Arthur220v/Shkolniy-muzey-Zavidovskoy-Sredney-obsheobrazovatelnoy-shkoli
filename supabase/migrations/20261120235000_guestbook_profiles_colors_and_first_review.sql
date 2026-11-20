drop index if exists public.guestbook_moderators_single_account_idx;

alter table public.guestbook_moderators
  add column last_seen_at timestamptz;

alter table public.guestbook_reviews
  add column is_first_review boolean not null default false,
  add column moderator_user_id uuid references auth.users (id) on delete set null,
  drop constraint if exists guestbook_reviews_avatar_color_check,
  add constraint guestbook_reviews_avatar_color_check
    check (
      avatar_color in ('blue', 'gold', 'green', 'burgundy', 'violet')
      or avatar_color ~ '^#[A-Fa-f0-9]{6}$'
    );

create unique index guestbook_reviews_single_first_review_idx
  on public.guestbook_reviews (is_first_review)
  where is_first_review;

with first_timur_review as (
  select id
  from public.guestbook_reviews
  where lower(btrim(first_name)) = 'тимур'
    and lower(btrim(last_name)) = 'пилипенко'
  order by created_at, id
  limit 1
)
update public.guestbook_reviews as review
set is_first_review = true
from first_timur_review
where review.id = first_timur_review.id;

update public.guestbook_reviews as review
set moderator_user_id = moderator.user_id
from (
  select user_id
  from public.guestbook_moderators
  order by created_at, user_id
  limit 1
) as moderator
where review.moderator_reply is not null
  and review.moderator_user_id is null;

drop policy if exists "Visitors can submit reviews for moderation"
  on public.guestbook_reviews;

create policy "Visitors can submit reviews for moderation"
  on public.guestbook_reviews
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and avatar_image_path is null
    and avatar_image_status in ('none', 'pending')
    and moderator_reply is null
    and moderator_replied_at is null
    and moderator_user_id is null
    and is_featured = false
    and is_first_review = false
  );

create or replace view public.guestbook_moderator_profile as
select
  profile_first_name,
  profile_last_name,
  profile_image_path,
  user_id,
  last_seen_at
from public.guestbook_moderators;

grant select on public.guestbook_moderator_profile to anon, authenticated;

create or replace function public.touch_guestbook_moderator_last_seen()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_guestbook_moderator() then
    raise exception 'Only moderators may update their last-seen time.';
  end if;

  update public.guestbook_moderators
  set last_seen_at = now()
  where user_id = auth.uid();
end
$$;

revoke all on function public.touch_guestbook_moderator_last_seen() from public, anon, authenticated;
grant execute on function public.touch_guestbook_moderator_last_seen() to authenticated;
