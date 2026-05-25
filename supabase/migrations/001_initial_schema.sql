-- ============================================================
-- Funrix Store Portal — Initial Schema Migration
-- ============================================================

-- 1. Organizations
create table public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  plan       text not null default 'basic'
             check (plan in ('basic', 'pro', 'enterprise')),
  created_at timestamptz not null default now()
);

-- 2. Stores
create table public.stores (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  name             text not null,
  slug             text unique not null,
  address          text,
  phone            text,
  opening_hours    jsonb,
  google_place_id  text,
  gbp_access_token text,
  meta_access_token text,
  line_webhook_url text,
  slack_webhook_url text,
  settings         jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 3. Users
create table public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email           text not null,
  display_name    text,
  role            text not null default 'staff'
                  check (role in ('owner', 'manager', 'staff', 'agent')),
  created_at      timestamptz not null default now()
);

-- 4. MEO Keywords
create table public.meo_keywords (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid not null references public.stores(id) on delete cascade,
  keyword    text not null,
  radius_km  numeric not null default 3,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. MEO Rankings
create table public.meo_rankings (
  id              uuid primary key default gen_random_uuid(),
  keyword_id      uuid not null references public.meo_keywords(id) on delete cascade,
  store_id        uuid not null references public.stores(id) on delete cascade,
  rank            integer,
  competitor_name text,
  competitor_rank integer,
  measured_at     timestamptz not null default now()
);

-- 6. Reviews
create table public.reviews (
  id             uuid primary key default gen_random_uuid(),
  store_id       uuid not null references public.stores(id) on delete cascade,
  source         text not null check (source in ('google', 'tabelog', 'instagram')),
  external_id    text,
  author_name    text,
  rating         numeric,
  body           text,
  reply_status   text not null default 'pending'
                 check (reply_status in ('pending', 'drafted', 'sent')),
  ai_draft_reply text,
  sent_reply     text,
  reviewed_at    timestamptz,
  created_at     timestamptz not null default now()
);

-- 7. Posts
create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid not null references public.stores(id) on delete cascade,
  created_by      uuid references public.users(id) on delete set null,
  image_urls      text[] not null default '{}',
  prompt          text,
  tone            text,
  template        text,
  ig_content      text,
  ig_hashtags     text,
  threads_content text,
  gbp_content     text,
  status          text not null default 'draft'
                  check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at    timestamptz,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 8. Post Platforms
create table public.post_platforms (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id) on delete cascade,
  platform      text not null check (platform in ('instagram', 'threads', 'gbp')),
  external_id   text,
  status        text not null default 'pending'
                check (status in ('pending', 'published', 'failed')),
  error_message text,
  published_at  timestamptz
);

-- 9. Reports
create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  store_id     uuid not null references public.stores(id) on delete cascade,
  period_start date not null,
  period_end   date not null,
  pdf_url      text,
  generated_at timestamptz not null default now()
);

-- 10. Audit Logs
create table public.audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  user_id         uuid,
  action          text not null,
  resource_type   text,
  resource_id     uuid,
  metadata        jsonb not null default '{}',
  created_at      timestamptz not null default now()
);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.stores
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Indexes
-- ============================================================
create index idx_meo_rankings_keyword_measured
  on public.meo_rankings (keyword_id, measured_at desc);

create index idx_reviews_store_created
  on public.reviews (store_id, created_at desc);

create index idx_posts_store_status_scheduled
  on public.posts (store_id, status, scheduled_at);

create index idx_audit_logs_org_created
  on public.audit_logs (organization_id, created_at desc);

-- ============================================================
-- RLS helper: get current user's organization_id
-- ============================================================
create or replace function public.get_user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.users
  where id = auth.uid()
$$;

-- ============================================================
-- Enable RLS on ALL tables
-- ============================================================
alter table public.organizations  enable row level security;
alter table public.stores         enable row level security;
alter table public.users          enable row level security;
alter table public.meo_keywords   enable row level security;
alter table public.meo_rankings   enable row level security;
alter table public.reviews        enable row level security;
alter table public.posts          enable row level security;
alter table public.post_platforms enable row level security;
alter table public.reports        enable row level security;
alter table public.audit_logs     enable row level security;

-- ============================================================
-- RLS Policies
-- ============================================================

-- organizations: users see only their own org
create policy "org_select" on public.organizations
  for select using (id = public.get_user_org_id());

create policy "org_update" on public.organizations
  for update using (id = public.get_user_org_id());

-- stores: scoped to organization
create policy "stores_select" on public.stores
  for select using (organization_id = public.get_user_org_id());

create policy "stores_insert" on public.stores
  for insert with check (organization_id = public.get_user_org_id());

create policy "stores_update" on public.stores
  for update using (organization_id = public.get_user_org_id());

create policy "stores_delete" on public.stores
  for delete using (organization_id = public.get_user_org_id());

-- users: scoped to organization
create policy "users_select" on public.users
  for select using (organization_id = public.get_user_org_id());

create policy "users_insert" on public.users
  for insert with check (organization_id = public.get_user_org_id());

create policy "users_update" on public.users
  for update using (organization_id = public.get_user_org_id());

create policy "users_delete" on public.users
  for delete using (organization_id = public.get_user_org_id());

-- meo_keywords: via store → organization
create policy "meo_keywords_select" on public.meo_keywords
  for select using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "meo_keywords_insert" on public.meo_keywords
  for insert with check (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "meo_keywords_update" on public.meo_keywords
  for update using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "meo_keywords_delete" on public.meo_keywords
  for delete using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

-- meo_rankings: via store → organization
create policy "meo_rankings_select" on public.meo_rankings
  for select using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "meo_rankings_insert" on public.meo_rankings
  for insert with check (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "meo_rankings_update" on public.meo_rankings
  for update using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "meo_rankings_delete" on public.meo_rankings
  for delete using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

-- reviews: via store → organization
create policy "reviews_select" on public.reviews
  for select using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "reviews_insert" on public.reviews
  for insert with check (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "reviews_update" on public.reviews
  for update using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "reviews_delete" on public.reviews
  for delete using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

-- posts: via store → organization
create policy "posts_select" on public.posts
  for select using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "posts_insert" on public.posts
  for insert with check (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "posts_update" on public.posts
  for update using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "posts_delete" on public.posts
  for delete using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

-- post_platforms: via post → store → organization
create policy "post_platforms_select" on public.post_platforms
  for select using (
    post_id in (
      select id from public.posts
      where store_id in (select id from public.stores where organization_id = public.get_user_org_id())
    )
  );

create policy "post_platforms_insert" on public.post_platforms
  for insert with check (
    post_id in (
      select id from public.posts
      where store_id in (select id from public.stores where organization_id = public.get_user_org_id())
    )
  );

create policy "post_platforms_update" on public.post_platforms
  for update using (
    post_id in (
      select id from public.posts
      where store_id in (select id from public.stores where organization_id = public.get_user_org_id())
    )
  );

create policy "post_platforms_delete" on public.post_platforms
  for delete using (
    post_id in (
      select id from public.posts
      where store_id in (select id from public.stores where organization_id = public.get_user_org_id())
    )
  );

-- reports: via store → organization
create policy "reports_select" on public.reports
  for select using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "reports_insert" on public.reports
  for insert with check (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "reports_update" on public.reports
  for update using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

create policy "reports_delete" on public.reports
  for delete using (
    store_id in (select id from public.stores where organization_id = public.get_user_org_id())
  );

-- audit_logs: scoped to organization (insert allowed, no update/delete)
create policy "audit_logs_select" on public.audit_logs
  for select using (organization_id = public.get_user_org_id());

create policy "audit_logs_insert" on public.audit_logs
  for insert with check (organization_id = public.get_user_org_id());
