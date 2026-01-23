
select id, metadata 
from public.orders 
where metadata is not null 
order by created_at desc 
limit 5;
