create table if not exists email_leads (
  id bigserial primary key,
  email text not null unique,
  source text,
  guide_url text,
  email_status text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  guide_sent_at timestamptz
);
