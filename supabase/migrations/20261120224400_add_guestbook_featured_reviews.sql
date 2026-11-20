alter table public.guestbook_reviews
  add column is_featured boolean not null default false;

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
        'review_featured',
        'review_unfeatured',
        'avatar_approved',
        'avatar_rejected',
        'avatar_reset',
        'avatar_submitted',
        'moderator_replied',
        'moderator_reply_updated',
        'moderator_reply_deleted'
      )
    );

create or replace function public.log_guestbook_featured_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_email text;
begin
  if new.is_featured is not distinct from old.is_featured then
    return new;
  end if;

  if actor_id is not null and public.is_guestbook_moderator() then
    select user_record.email
    into actor_email
    from auth.users as user_record
    where user_record.id = actor_id;
  else
    actor_id := null;
  end if;

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
    case when new.is_featured then 'review_featured' else 'review_unfeatured' end,
    old.is_featured::text,
    new.is_featured::text,
    new.avatar_image_status,
    new.moderator_reply,
    actor_id,
    actor_email
  );

  return new;
end
$$;

revoke all on function public.log_guestbook_featured_status() from public, anon, authenticated;

create trigger guestbook_review_featured_history
  after update of is_featured on public.guestbook_reviews
  for each row
  execute function public.log_guestbook_featured_status();
