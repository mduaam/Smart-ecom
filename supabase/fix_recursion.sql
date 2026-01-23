-- Fix for Infinite Recursion in RLS Policies
-- We use a SECYRITY DEFINER function to read the role without triggering RLS on profiles again.

create or replace function public.get_my_role()
returns text
language plpgsql
security definer
set search_path = public -- Secure search path
as $$
begin
  return (select role from public.profiles where id = auth.uid());
end;
$$;

-- Grant execute to auth users
grant execute on function public.get_my_role to authenticated;

-- ==========================================
-- Update Coupons Policies
-- ==========================================
drop policy if exists "Admins can manage coupons" on public.coupons;
create policy "Admins can manage coupons" on public.coupons
  for all using (
    get_my_role() in ('admin', 'super_admin')
  );

-- ==========================================
-- Update Tickets Policies
-- ==========================================
drop policy if exists "Admins manage all tickets" on public.tickets;
create policy "Admins manage all tickets" on public.tickets
  for all using (
    get_my_role() in ('admin', 'support', 'super_admin')
  );

drop policy if exists "Admins manage messages" on public.ticket_messages;
create policy "Admins manage messages" on public.ticket_messages
  for all using (
    get_my_role() in ('admin', 'support', 'super_admin')
  );

-- ==========================================
-- Update Audit Logs Policies
-- ==========================================
drop policy if exists "Admins view audit logs" on public.order_audit_logs;
create policy "Admins view audit logs" on public.order_audit_logs
  for select using (
     get_my_role() in ('admin', 'super_admin')
  );

-- ==========================================
-- Update Orders Policies (Existing)
-- ==========================================
-- We should also fix orders policies if they exist and cause issues
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders" on public.orders
  for select using (
     get_my_role() in ('admin', 'super_admin')
  );

drop policy if exists "Admins can insert orders" on public.orders;
create policy "Admins can insert orders" on public.orders
  for insert with check (
     get_my_role() in ('admin', 'super_admin')
  );

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
  for update using (
     get_my_role() in ('admin', 'super_admin')
  );
