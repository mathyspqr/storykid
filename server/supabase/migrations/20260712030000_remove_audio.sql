alter table public.stories drop column if exists audio_requested;
alter table public.purchases drop column if exists audio_included;
-- Le bucket est conservé : Supabase interdit sa suppression directe en SQL
-- afin d'éviter de laisser des objets orphelins. Il n'est plus utilisé par StoryKid.
