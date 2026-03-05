create database if not exists elysiumDatabase; 

use elysiumDatabase; 

create table if not exists user(
    user_id bigint primary key AUTO_INCREMENT, 
    first_name varchar(100) not null, 
    surnames varchar(200) not null,
    username varchar(50) not null unique, 
    password varchar(255) not null, 
    email varchar(100) not null, 
    profile_img varchar(200)
);

-- TODO Implementar las demás tablas. 

create table if not exists follow(
    follower_id bigint,
    followed_id bigint,
    PRIMARY KEY (follower_id, followed_id), 
    constraint fk_follower_user FOREIGN KEY (follower_id) references user(user_id) on delete cascade, 
    constraint fk_followed_user FOREIGN KEY (followeb_id) references user(user_id) on delete cascade 
); 

create table if not exists post(
    post_id bigint primary key AUTO_INCREMENT, 
    user_id bigint not null,
    title varchar(200), 
    description_post varchar(500), 
    created_at  timestamp default current_timestamp, 
    constraint fk_post_user FOREIGN key (user_id) references user(user_id) on delete cascade
); 

