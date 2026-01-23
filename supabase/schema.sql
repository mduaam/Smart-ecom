-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text unique,
  full_name text,
  role text default 'user',
  avatar_url text,
  subscription_status text default 'inactive',
  subscription_end_date timestamp with time zone,

  constraint username_length check (char_length(full_name) >= 2)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This triggers a profile creation when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Orders Table
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null, -- Links to the authenticated user
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  plan_name text not null,
  amount numeric not null,
  discount_amount numeric default 0,
  final_amount numeric not null, -- Calculated/Stored final amount
  currency text default 'USD',
  payment_status text default 'unpaid', -- unpaid, paid, refunded
  fulfillment_status text default 'pending', -- pending, active, shipped, cancelled
  coupon_code text,
  internal_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Orders
alter table orders enable row level security;

-- Users can view their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

-- Admins can view all orders (Assuming 'admin' role in profiles or custom claim)
-- This is a simplified policy. In production, check against profiles.role or claims.
create policy "Admins can view all orders" on orders
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Admins can insert/update orders
create policy "Admins can insert orders" on orders
  for insert with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update orders" on orders
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
