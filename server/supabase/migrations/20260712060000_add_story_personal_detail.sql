alter table public.stories add column if not exists personal_detail text;
alter table public.stories drop constraint if exists stories_personal_detail_length_check;
alter table public.stories add constraint stories_personal_detail_length_check check (personal_detail is null or char_length(personal_detail) <= 100);
