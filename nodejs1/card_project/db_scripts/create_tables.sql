drop table if exists user_info;
create table user_info (
	id				bigserial not null primary key,
	pwd				char(128), -- md5(id+password)
	gender			tinyint,
	name			varchar(128),
	head_url		varchar(128),
	title			varchar(128),
	email			varchar(128),
	mobile			varchar(128),
	phone			varchar(128),
	fax				varchar(128),
	qq_no			varchar(128),
	wechat_no		varchar(128),
	private_site	varchar(128),
	private_desp	text,
	com_site		varchar(128),
	com_name		varchar(128),
	com_desp		text,
	com_address		text,
	longitude		double,
	latitude		double,
);