-- 필요한 테이블이 따로 없습니다.

select t.ip as t_ip, t2.ip as t2_ip,
cast(split_part(t.ip,'.',1)as integer) as ip_part_1,
cast(split_part(t.ip,'.',2)as integer) as ip_part_2,
cast(split_part(t2.ip,'.',3)as integer) as ip_part_3,
cast(split_part(t2.ip,'.',4)as integer) as ip_part_4
from
(select cast('192.168.0.1' as text) as ip) as t,
(select cast('127.0.0.0' as text) as ip) as t2;