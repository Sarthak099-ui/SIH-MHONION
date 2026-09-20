-- Supabase Migration: 0001_init.sql
-- Onion Quality Assessment & Grading System
-- Exact schema and Row-Level Security (RLS) policies

-- 1. Profiles Table (Extends Supabase's built-in auth.users with app-specific role info)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role text check (role in ('farmer','grader','buyer','admin')) not null default 'farmer',
  center_id uuid,
  created_at timestamptz default now()
);

-- Helper function: avoids the classic RLS infinite-recursion bug you get when a
-- policy on `profiles` queries `profiles` to check the caller's own role.
-- SECURITY DEFINER lets this one lookup bypass RLS internally; the outer
-- query the user actually ran still gets RLS applied normally.
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;

-- Profiles RLS Policies
create policy "view own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "admins view all profiles" on public.profiles for select using (public.get_my_role() = 'admin');
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 2. Lots Table
create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.profiles(id) not null,
  center_id uuid,
  location_text text,
  status text check (status in ('captured','detected','graded','listed','sold')) default 'captured',
  created_at timestamptz default now()
);
alter table public.lots enable row level security;

-- Lots RLS Policies
create policy "farmers manage own lots" on public.lots for all
  using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);
create policy "graders and admins view all lots" on public.lots for select
  using (public.get_my_role() in ('grader','admin'));
create policy "graders update lot status" on public.lots for update
  using (public.get_my_role() in ('grader','admin'));

-- 3. Images Table
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references public.lots(id) on delete cascade not null,
  storage_path text not null,
  annotated_storage_path text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.images enable row level security;

-- Images RLS Policies
create policy "view images of accessible lots" on public.images for select
  using (exists (select 1 from public.lots l where l.id = lot_id
    and (l.farmer_id = auth.uid() or public.get_my_role() in ('grader','admin'))));
create policy "insert images to own lots" on public.images for insert
  with check (exists (select 1 from public.lots l where l.id = lot_id and l.farmer_id = auth.uid()));

-- 4. Detections Table
create table if not exists public.detections (
  id uuid primary key default gen_random_uuid(),
  image_id uuid references public.images(id) on delete cascade not null,
  class text check (class in ('healthy','damaged','rotten','sprouted','undersized')) not null,
  confidence numeric check (confidence between 0 and 1),
  bbox jsonb,
  created_at timestamptz default now()
);
alter table public.detections enable row level security;

-- Detections RLS Policies
create policy "view detections of accessible lots" on public.detections for select
  using (exists (select 1 from public.images i join public.lots l on l.id = i.lot_id
    where i.id = image_id and (l.farmer_id = auth.uid() or public.get_my_role() in ('grader','admin'))));
-- No client insert policy on purpose: only the backend (service-role key) writes detections.

-- 5. Grades Table
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references public.lots(id) on delete cascade not null,
  grade_label text check (grade_label in ('A','B','URS')) not null,
  pct_healthy numeric, 
  pct_damaged numeric, 
  pct_rotten numeric,
  pct_sprouted numeric, 
  pct_undersized numeric,
  rule_version text default 'v1',
  overridden_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz default now()
);
alter table public.grades enable row level security;

-- Grades RLS Policies
create policy "view grades of accessible lots" on public.grades for select
  using (exists (select 1 from public.lots l where l.id = lot_id
    and (l.farmer_id = auth.uid() or public.get_my_role() in ('grader','admin'))));
create policy "graders override grades" on public.grades for update
  using (public.get_my_role() in ('grader','admin'));

-- 6. Listings Table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references public.lots(id) on delete cascade not null,
  farmer_id uuid references public.profiles(id) not null,
  quantity_kg numeric not null,
  base_price_per_kg numeric not null,
  status text check (status in ('active','sold','cancelled')) default 'active',
  created_at timestamptz default now()
);
alter table public.listings enable row level security;

-- Listings RLS Policies
create policy "view active listings, own listings, or admin" on public.listings for select
  using (status = 'active' or farmer_id = auth.uid() or public.get_my_role() = 'admin');
create policy "farmers manage own listings" on public.listings for all
  using (farmer_id = auth.uid()) with check (farmer_id = auth.uid());

-- 7. Audit Logs Table (Tamper-evident system event stream)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  role text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;

-- Audit Logs RLS Policies
create policy "admins view all audit logs" on public.audit_logs for select
  using (public.get_my_role() = 'admin');
create policy "users view own audit entries" on public.audit_logs for select
  using (user_id = auth.uid());
-- No client insert policy: only the backend, using the service-role key, writes
-- audit entries. That's what makes the log tamper-evident — a farmer or buyer
-- account has no way to write or edit their own history, even a malicious one.

-- 8. Supabase Storage Bucket Provisioning (onion-images)
insert into storage.buckets (id, name, public)
values ('onion-images', 'onion-images', true)
on conflict (id) do nothing;

create policy "Public view onion images"
  on storage.objects for select
  using (bucket_id = 'onion-images');

create policy "Authenticated users upload onion images"
  on storage.objects for insert
  with check (bucket_id = 'onion-images' and auth.role() = 'authenticated');
