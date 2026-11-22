create or replace function public.get_guestbook_moderator_directory()
returns table (
  user_id uuid,
  profile_first_name text,
  profile_last_name text,
  last_seen_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_guestbook_moderator() then
    raise exception 'Only moderators may view the moderator directory.';
  end if;

  return query
  select
    moderator.user_id,
    moderator.profile_first_name,
    moderator.profile_last_name,
    moderator.last_seen_at
  from public.guestbook_moderators as moderator
  order by
    moderator.profile_last_name nulls last,
    moderator.profile_first_name nulls last,
    moderator.created_at,
    moderator.user_id;
end
$$;

revoke all on function public.get_guestbook_moderator_directory() from public, anon, authenticated;
grant execute on function public.get_guestbook_moderator_directory() to authenticated;
