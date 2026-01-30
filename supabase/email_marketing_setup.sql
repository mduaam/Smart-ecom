-- ==========================================
-- EMAIL MARKETING TABLES
-- ==========================================

-- 1. Campaigns History & Drafts
create table if not exists public.email_campaigns (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  content text not null, -- HTML content
  filter_config jsonb default '{}'::jsonb,
  status text default 'draft' check (status in ('draft', 'sending', 'sent', 'failed')),
  recipients_count int default 0,
  sent_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Templates
create table if not exists public.email_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS Policies
alter table public.email_campaigns enable row level security;
alter table public.email_templates enable row level security;

-- Only Admins and Super Admins can manage campaigns and templates
create policy "Admins manage email campaigns" 
on public.email_campaigns 
for all 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'super_admin')
  )
);

create policy "Admins manage email templates" 
on public.email_templates 
for all 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'super_admin')
  )
);
