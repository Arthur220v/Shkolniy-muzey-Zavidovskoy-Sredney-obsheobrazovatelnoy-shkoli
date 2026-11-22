do $$
declare
  updated_reviews integer;
  target_review_id uuid;
begin
  update public.guestbook_reviews
  set
    first_name = 'A.',
    last_name = 'Mkhitaryan'
  where status = 'approved'
    and first_name = '--'
    and last_name = '--'
    and created_at::date = date '2026-11-22'
  returning id into target_review_id;

  get diagnostics updated_reviews = row_count;

  if updated_reviews <> 1 then
    raise exception
      'Expected to update exactly one approved review by "-- --" dated 2026-11-22, updated %.',
      updated_reviews;
  end if;

  update public.guestbook_moderation_history
  set
    reviewer_first_name = 'A.',
    reviewer_last_name = 'Mkhitaryan'
  where review_id = target_review_id;
end
$$;
