alter table public.museum_news_photos
  drop constraint if exists museum_news_photos_sort_order_check,
  drop constraint if exists museum_news_photos_sort_order_nonnegative_check,
  alter column sort_order type bigint using sort_order::bigint;

alter table public.museum_news_photos
  add constraint museum_news_photos_sort_order_nonnegative_check
    check (sort_order >= 0);
