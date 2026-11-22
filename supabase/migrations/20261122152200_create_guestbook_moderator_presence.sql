create table if not exists public.guestbook_moderator_presence (
  user_id uuid not null references public.guestbook_moderators (user_id) on delete cascade,
  session_id uuid not null,
  last_active_at timestamptz not null default now(),
  primary key (user_id, session_id)
);

create index if not exists guestbook_moderator_presence_last_active_at_idx
  on public.guestbook_moderator_presence (last_active_at);

alter table public.guestbook_moderator_presence enable row level security;
revoke all on table public.guestbook_moderator_presence from public, anon, authenticated;

create or replace view public.guestbook_moderator_profile as
select
  moderator.profile_first_name,
  moderator.profile_last_name,
  moderator.profile_image_path,
  moderator.user_id,
  moderator.last_seen_at,
  exists (
    select 1
    from public.guestbook_moderator_presence as presence
    where presence.user_id = moderator.user_id
      and presence.last_active_at > now() - interval '90 seconds'
  ) as is_online
from public.guestbook_moderators as moderator;

grant select on public.guestbook_moderator_profile to anon, authenticated;

create or replace function public.set_guestbook_moderator_presence(
  p_session_id uuid,
  p_is_online boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  moderator_id uuid := auth.uid();
begin
  if moderator_id is null or not public.is_guestbook_moderator() then
    raise exception 'Only moderators may update their online presence.';
  end if;

  if p_session_id is null or p_is_online is null then
    raise exception 'A session ID and online state are required.';
  end if;

  if p_is_online then
    insert into public.guestbook_moderator_presence (
      user_id,
      session_id,
      last_active_at
    )
    values (
      moderator_id,
      p_session_id,
      now()
    )
    on conflict (user_id, session_id)
    do update set last_active_at = excluded.last_active_at;
  else
    delete from public.guestbook_moderator_presence
    where user_id = moderator_id
      and session_id = p_session_id;
  end if;

  delete from public.guestbook_moderator_presence
  where last_active_at < now() - interval '1 day';
end
$$;

revoke all on function public.set_guestbook_moderator_presence(uuid, boolean)
  from public, anon, authenticated;
grant execute on function public.set_guestbook_moderator_presence(uuid, boolean)
  to authenticated;
