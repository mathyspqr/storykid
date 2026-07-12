create or replace function public.claim_next_generation_job()
returns table(id uuid, story_id uuid, job_type text, attempt_count integer)
language plpgsql security definer set search_path=public as $$
declare selected_id uuid;
begin
  update public.generation_jobs j set status='failed', completed_at=now(), error_code='STALE_JOB_LIMIT', error_message='Worker stopped repeatedly before completion.'
  where j.status='running' and j.started_at < now() - interval '10 minutes' and j.attempt_count >= 3;
  update public.stories s set status=case when j.job_type='preview' then 'preview_failed' else 'generation_failed' end, updated_at=now()
  from public.generation_jobs j where j.story_id=s.id and j.status='failed' and j.error_code='STALE_JOB_LIMIT' and s.status in ('preview_generating','full_generating');
  update public.generation_jobs j set status='queued', started_at=null, error_code='STALE_JOB_RECOVERED'
  where j.status='running' and j.started_at < now() - interval '10 minutes' and j.attempt_count < 3;
  select j.id into selected_id from public.generation_jobs j where j.status='queued' order by j.created_at for update skip locked limit 1;
  if selected_id is null then return; end if;
  update public.generation_jobs j set status='running', attempt_count=j.attempt_count+1, started_at=now(), completed_at=null, error_code=null, error_message=null where j.id=selected_id;
  return query select j.id,j.story_id,j.job_type,j.attempt_count from public.generation_jobs j where j.id=selected_id;
end; $$;
revoke all on function public.claim_next_generation_job() from public, anon, authenticated;
grant execute on function public.claim_next_generation_job() to service_role;
