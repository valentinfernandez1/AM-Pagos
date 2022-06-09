drop table if exists user;
create table user (
  iduser bigint identity(1, 1) not null,
  firstname nvarchar(255) not null,
  lastname nvarchar(255) not null,
  primary key(iduser)
)
