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





