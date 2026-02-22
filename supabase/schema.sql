-- AtomicSync Phase 1 — Supabase Schema
-- Run this in the Supabase SQL editor

create table votes (
  id uuid default gen_random_uuid() primary key,
  feature text not null check (feature in ('rotation', 'accuracy', 'service', 'other')),
  other_text text,
  created_at timestamptz default now()
);

create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  voted_feature text check (voted_feature in ('rotation', 'accuracy', 'service', 'other')),
  other_text text,
  created_at timestamptz default now()
);