-- PROPOSTA FASE 2/3. Não aplicada. Requer Supabase Auth e revisão operacional.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
create table public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('imobiliario','amortizacao','consorcio','veiculo','quitacao','investimentos')),
  title text not null,
  engine_version text not null,
  created_at timestamptz not null default now(),
  unique (id,user_id)
);
create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parameters jsonb not null,
  computed_result jsonb not null,
  created_at timestamptz not null default now(),
  foreign key (simulation_id,user_id) references public.simulations(id,user_id) on delete cascade
);
create table public.plans (
  id text primary key,
  label text not null,
  price_cents integer not null check(price_cents>=0),
  report_limit integer not null check(report_limit>=0),
  enabled boolean not null default false
);
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null references public.plans(id),
  provider_id text unique,
  status text not null check(status in ('pending','active','past_due','cancelled','expired')),
  valid_until timestamptz
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider_id text unique,
  amount_cents integer not null check(amount_cents>=0),
  status text not null check(status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  unique (id,user_id)
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  simulation_id uuid not null,
  payment_id uuid,
  storage_key text unique,
  engine_version text not null,
  generated_at timestamptz,
  foreign key (simulation_id,user_id) references public.simulations(id,user_id) on delete cascade,
  foreign key (payment_id,user_id) references public.payments(id,user_id)
);
create table public.webhook_events (
  provider text not null,
  event_id text not null,
  payload_hash text not null,
  processed_at timestamptz,
  primary key (provider,event_id)
);
create table public.content_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  published_at timestamptz
);
create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  event_type text not null,
  simulator_kind text,
  occurred_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.simulations enable row level security;
alter table public.scenarios enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.reports enable row level security;
alter table public.webhook_events enable row level security;
alter table public.content_articles enable row level security;
alter table public.usage_events enable row level security;
create policy profile_owner on public.profiles for all to authenticated using(auth.uid()=id) with check(auth.uid()=id);
create policy simulation_owner on public.simulations for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy scenario_owner on public.scenarios for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy plans_read on public.plans for select using(enabled=true);
create policy subscription_read on public.subscriptions for select to authenticated using(auth.uid()=user_id);
create policy payment_read on public.payments for select to authenticated using(auth.uid()=user_id);
-- Storage paths não são expostos diretamente. Uma função autorizada deve entregar URLs assinadas.
-- reports/webhook_events/usage_events não têm políticas de cliente: acesso somente backend.
create policy article_read on public.content_articles for select using(published_at<=now());
create index simulations_owner_date on public.simulations(user_id,created_at desc);
create index scenarios_owner on public.scenarios(user_id,simulation_id);
create index usage_metrics on public.usage_events(occurred_at,event_type,simulator_kind);
-- Nunca confiar em status de pagamento ou papel admin enviados pelo cliente.
-- Antes de produção: definir retenção comercial, exclusão transacional/anonimização,
-- webhook assinado e idempotente, storage privado e autorização por entitlement.
