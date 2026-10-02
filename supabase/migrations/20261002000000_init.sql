-- Pictopia Photobooth — initial schema
-- All access goes through the website's server using the secret key.
-- RLS is enabled with no policies, so the public (anon) key can read or write nothing.

-- ---------------------------------------------------------------------------
-- Settings (single row, edit in the Supabase table editor)
-- ---------------------------------------------------------------------------
create table public.settings (
  id smallint primary key default 1 check (id = 1),
  max_events_per_day smallint not null default 2 check (max_events_per_day between 1 and 20),
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1);

comment on table public.settings is 'Site settings. max_events_per_day = confirmed bookings allowed on one date before the calendar shows it as full.';

-- ---------------------------------------------------------------------------
-- Booking requests
-- ---------------------------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Owners change this in the dashboard after calling the customer.
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'cancelled')),

  event_type text not null,
  event_date date not null,
  start_time time not null,
  venue text,
  town text not null,
  province text not null check (province in ('Tarlac', 'Pampanga', 'Other')),

  tier text not null check (tier in ('one', 'two', 'multi')),
  print_format text not null,
  display text not null check (display in ('standee', 'magnetic')),
  backdrop_color text not null check (backdrop_color in ('blue', 'pink', 'gray', 'white')),
  backdrop_finish text not null check (backdrop_finish in ('sequin', 'plain')),
  plan jsonb not null,
  extra_hours smallint not null default 0 check (extra_hours between 0 and 3),
  package_total integer not null check (package_total > 0),

  customer_name text not null,
  mobile text not null,
  email text,
  facebook text,
  notes text,

  owner_notified_at timestamptz,
  customer_notified_at timestamptz,
  owner_notes text
);

comment on table public.bookings is 'Booking requests from the website. Call the customer, then set status to confirmed or declined. First to confirm gets the slot.';
comment on column public.bookings.package_total is 'Pesos, excluding travel fee. Calculated on the server.';
comment on column public.bookings.owner_notes is 'Private notes for the owners (travel fee agreed, call log, etc).';

create index bookings_event_date_status_idx on public.bookings (event_date, status);
create index bookings_mobile_created_idx on public.bookings (mobile, created_at desc);

-- ---------------------------------------------------------------------------
-- Partner enquiries (caterers, stylists, coordinators)
-- ---------------------------------------------------------------------------
create table public.partner_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_name text not null,
  business_type text not null,
  contact_name text not null,
  mobile text not null,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  owner_notified_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Promo alert subscribers
-- ---------------------------------------------------------------------------
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create function public.touch_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Owner-friendly view: upcoming requests, soonest first
-- ---------------------------------------------------------------------------
create view public.upcoming_bookings
with (security_invoker = true) as
select
  event_date,
  status,
  reference,
  customer_name,
  mobile,
  event_type,
  start_time,
  coalesce(venue || ', ', '') || town || ', ' || province as location,
  package_total,
  created_at
from public.bookings
where event_date >= (now() at time zone 'Asia/Manila')::date
order by event_date, created_at;

-- ---------------------------------------------------------------------------
-- Lock everything down
-- ---------------------------------------------------------------------------
alter table public.settings enable row level security;
alter table public.bookings enable row level security;
alter table public.partner_enquiries enable row level security;
alter table public.subscribers enable row level security;

revoke all on public.settings, public.bookings, public.partner_enquiries, public.subscribers, public.upcoming_bookings
  from anon, authenticated;
