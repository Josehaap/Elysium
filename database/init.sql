create database if not exists elysiumDatabase; 

use elysiumDatabase; 

create table if not exists user(
    user_id bigint primary key AUTO_INCREMENT, 
    first_name varchar(100) not null, 
    surnames varchar(200) not null,
    username varchar(50) not null unique, 
    password varchar(255) not null, 
    email varchar(100) not null unique, 
    profile_img varchar(200)
);

create table if not exists user_activity(
    activity_id bigint primary key AUTO_INCREMENT, 
    user_id bigint not null, 
    action_type ENUM('create', 'update', 'delete') not null,
    action_details text not null, 
    create_at timestamp default current_timestamp, 
    constraint fk_userAct_user FOREIGN KEY (user_id) references user(user_id)
);

create table if not exists user_enterprise(
    user_id bigint primary key, 
    enterprise_name varchar(100),
    enterprise_phone varchar(15), 
    is_active boolean not null, 
    constraint fk_userEnterprise_user FOREIGN KEY (user_id) references user(user_id)
); 
-- TODO Implementar las demás tablas. 

create table if not exists follow(
    follower_id bigint,
    followed_id bigint,
    PRIMARY KEY (follower_id, followed_id), 
    constraint fk_follower_user FOREIGN KEY (follower_id) references user(user_id) on delete cascade, 
    constraint fk_followed_user FOREIGN KEY (followed_id) references user(user_id) on delete cascade 
); 

create table if not exists post(
    post_id bigint primary key AUTO_INCREMENT, 
    user_id bigint not null,
    title varchar(200), 
    description_post varchar(500), 
    created_at  timestamp default current_timestamp, 
    constraint fk_post_user FOREIGN key (user_id) references user(user_id) on delete cascade
); 

create table if not exists `like`(
    user_id bigint, 
    post_id bigint, 
    PRIMARY KEY (user_id, post_id),
    constraint fk_like_user FOREIGN key (user_id) references user(user_id) on delete cascade, 
    constraint fk_like_post FOREIGN key (post_id) references post(post_id) on delete cascade
);


create table if not exists comment(
    comment_id bigint primary key AUTO_INCREMENT, 
    user_id bigint not null, 
    message text not null, 
    post_id bigint not null, 
    created_at timestamp default current_timestamp
);

create table if not exists chat(
    chat_id bigint primary key AUTO_INCREMENT, 
    user_1 bigint not null, 
    user_2 bigint not null,
    constraint fk_chat_sender FOREIGN KEY (user_1) references user(user_id) on delete cascade,
    constraint fk_chat_receiver FOREIGN KEY (user_2) references user(user_id) on delete cascade,
    constraint chk_user_order check (user_1 < user_2), 
    constraint uq_chat_users unique(user_1, user_2)
);


create table if not exists `message`(
    message_id bigint primary key AUTO_INCREMENT, 
    chat_id bigint not null, 
    content text not null, 
    sennt_at timestamp default current_timestamp, 
    is_read boolean, 
    user_send_id bigint not null
);

create table if not exists job(
    job_id bigint primary key AUTO_INCREMENT, 
    user_id bigint not null, 
    title varchar(200) not null, 
    description text not null, 
    location varchar(100) not null, 
    salary varchar(50) not null, 
    created_at timestamp default current_timestamp, 
    is_active boolean not null,
    constraint fk_job_user FOREIGN key (user_id) references user(user_id)
);

create table if not exists application(
    application_job bigint primary key AUTO_INCREMENT, 
    job_id bigint not null, 
    user_id bigint not null, 
    message text not null,
    applied_at timestamp not null, 
    constraint fk_aplication_job FOREIGN KEY(job_id) references job(job_id),
    constraint fk_aplication_user FOREIGN KEY(user_id) references user(user_id)
);