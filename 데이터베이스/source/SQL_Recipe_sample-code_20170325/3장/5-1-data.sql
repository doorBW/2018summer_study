DROP TABLE IF EXISTS mst_users;
CREATE TABLE mst_users(
    user_id         varchar(255)
  , register_date   varchar(255)
  , register_device integer
);

INSERT INTO mst_users
VALUES
    ('U001', '2016-08-26', 1)
  , ('U002', '2016-08-26', 2)
  , ('U003', '2016-08-27', 3)
;

select user_id, case
when register_device = 1 then 'desktop',
when register_device = 2 then 'smartphone',
when register_device = 3 then 'application'
else 'default'
end as device_name
from mst_users;

