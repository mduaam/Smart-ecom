-- Inspect order_items table schema
select column_name, data_type 
from information_schema.columns 
where table_schema = 'public' 
and table_name = 'order_items';
