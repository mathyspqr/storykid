alter table public.generation_jobs add column if not exists progress integer not null default 0 check (progress between 0 and 100);

create table if not exists public.preview_rate_limits (
  ip_hash text not null,
  day date not null default current_date,
  count integer not null default 0,
  primary key (ip_hash, day)
);

alter table public.preview_rate_limits enable row level security;

create or replace function public.consume_preview_quota(p_ip_hash text)
returns boolean
language plpgsql security definer set search_path=public as $$
declare next_count integer;
begin
  insert into public.preview_rate_limits(ip_hash, day, count) values (p_ip_hash, current_date, 1)
  on conflict (ip_hash, day) do update set count = public.preview_rate_limits.count + 1
  returning count into next_count;
  return next_count <= 1;
end; $$;

revoke all on function public.consume_preview_quota(text) from public, anon, authenticated;
grant execute on function public.consume_preview_quota(text) to service_role;
