-- Supabase schema for AI UX Audit Engine MVP

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  input_type text not null default 'screenshot',
  input_image_path text not null,
  status text not null default 'done',
  summary text not null,
  created_at timestamp without time zone not null default now()
);

create table if not exists public.audit_items (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  severity integer not null,
  category text not null,
  title text not null,
  evidence text not null,
  recommendation text not null,
  effort text not null check (effort in ('low', 'med', 'high')),
  impact text not null check (impact in ('low', 'med', 'high'))
);

-- Storage
-- Bucket: audit-inputs (private)
-- Recommended path pattern: inputs/<audit-uuid>.<ext>

