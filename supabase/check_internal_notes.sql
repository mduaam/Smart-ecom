
select column_name, data_type 
from information_schema.columns 
where table_name = 'orders' 
and column_name = 'internal_notes';
