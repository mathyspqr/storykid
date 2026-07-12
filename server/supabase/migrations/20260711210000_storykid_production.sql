create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft', moment text, child_name text, child_age integer, child_pronoun text,
  universe text, companion text, emotional_goal text, tone text, format text, page_count integer,
title text, subtitle text, cover_storage_path text,
  claim_token uuid not null default gen_random_uuid(),
  preview_generated_at timestamptz, paid_at timestamptz, full_generated_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint stories_status_check check (status in ('draft','preview_queued','preview_generating','preview_ready','auth_required','payment_required','checkout_created','paid','full_generation_queued','full_generating','ready','preview_failed','generation_failed','refunded','cancelled')),
  constraint stories_age_check check (child_age between 3 and 9),
  constraint stories_page_count_check check (page_count in (6,8))
);

create table if not exists public.story_pages (
  id uuid primary key default gen_random_uuid(), story_id uuid not null references public.stories(id) on delete cascade,
  page_number integer not null, text text not null, illustration_storage_path text, is_preview boolean not null default false,
  created_at timestamptz not null default now(), unique(story_id,page_number)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade, stripe_checkout_session_id text unique,
  stripe_payment_intent_id text, amount_cents integer not null, currency text not null default 'eur', offer_id text not null,
status text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(), story_id uuid not null references public.stories(id) on delete cascade,
  job_type text not null, status text not null, attempt_count integer not null default 0, provider_job_id text,
  error_code text, error_message text, started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(),
  unique(story_id,job_type)
);

create table if not exists public.reading_progress (
  user_id uuid not null references auth.users(id) on delete cascade, story_id uuid not null references public.stories(id) on delete cascade,
  last_page integer not null default 1, updated_at timestamptz not null default now(), primary key(user_id,story_id)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  story_id uuid references public.stories(id) on delete set null, event_name text not null, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint analytics_event_name_check check (event_name in ('create_story_started','questionnaire_step_viewed','questionnaire_option_selected','questionnaire_completed','preview_requested','preview_ready','preview_opened','preview_page_read','auth_gate_viewed','account_created','paywall_viewed','checkout_started','payment_completed','full_story_ready','library_opened','story_opened'))
);

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_pages enable row level security;
alter table public.purchases enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.reading_progress enable row level security;
alter table public.analytics_events enable row level security;

create policy "profiles own row" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own row" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "stories own rows" on public.stories for select using (auth.uid() = user_id);
create policy "stories create own rows" on public.stories for insert with check (auth.uid() = user_id);
create policy "preview or paid pages only" on public.story_pages for select using (
  exists(select 1 from public.stories s where s.id=story_id and s.user_id=auth.uid() and (page_number=1 or s.status in ('paid','full_generation_queued','full_generating','ready')))
);
create policy "purchases own rows" on public.purchases for select using (auth.uid() = user_id);
create policy "progress own rows" on public.reading_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analytics insert own events" on public.analytics_events for insert with check (auth.uid() = user_id);

create or replace function public.claim_next_generation_job()
returns table(id uuid, story_id uuid, job_type text, attempt_count integer)
language plpgsql security definer set search_path=public as $$
declare selected_id uuid;
begin
  update public.generation_jobs set status='failed', completed_at=now(), error_code='STALE_JOB_LIMIT', error_message='Worker stopped repeatedly before completion.'
  where status='running' and started_at < now() - interval '10 minutes' and generation_jobs.attempt_count >= 3;
  update public.stories s set status=case when j.job_type='preview' then 'preview_failed' else 'generation_failed' end, updated_at=now()
  from public.generation_jobs j where j.story_id=s.id and j.status='failed' and j.error_code='STALE_JOB_LIMIT' and s.status in ('preview_generating','full_generating');
  update public.generation_jobs set status='queued', started_at=null, error_code='STALE_JOB_RECOVERED'
  where status='running' and started_at < now() - interval '10 minutes' and attempt_count < 3;
  select j.id into selected_id
  from public.generation_jobs j
  where j.status = 'queued'
  order by j.created_at
  for update skip locked
  limit 1;
  if selected_id is null then return; end if;
  update public.generation_jobs j set
    status='running', attempt_count=j.attempt_count+1, started_at=now(), completed_at=null,
    error_code=null, error_message=null
  where j.id=selected_id;
  return query select j.id,j.story_id,j.job_type,j.attempt_count from public.generation_jobs j where j.id=selected_id;
end; $$;
revoke all on function public.claim_next_generation_job() from public, anon, authenticated;
grant execute on function public.claim_next_generation_job() to service_role;

insert into storage.buckets(id,name,public) values ('story-covers','story-covers',false),('story-illustrations','story-illustrations',false),('story-pdfs','story-pdfs',false) on conflict (id) do nothing;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,email,is_anonymous) values(new.id,new.email,coalesce(new.is_anonymous,false)) on conflict(id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.handle_user_update() returns trigger language plpgsql security definer set search_path=public as $$
begin
  update public.profiles set email=new.email, is_anonymous=coalesce(new.is_anonymous,false), updated_at=now() where id=new.id;
  return new;
end; $$;
drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated after update of email,is_anonymous on auth.users for each row execute procedure public.handle_user_update();
