
select id, customer_name, customer_email, customer_phone 
from public.orders 
order by created_at desc 
limit 5;
