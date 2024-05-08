CREATE table users (
    username varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    primary key(username)
);

CREATE table posts (
    post_id int not null auto_increment,
    username varchar(100) not null,
    post varchar(255) not null,
    post_time timestamp not null default CURRENT_TIMESTAMP,
    likes int not null default 0,
    primary key(post_id),
    -- https://stackoverflow.com/questions/1668695/updating-foreign-key-values
    foreign key(username) references users(username) on update cascade
);

insert into users (username, password) values ("placeholder", "placeholder");

insert into posts (username, post) values ("placeholder", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fringilla massa sed nisi sagittis faucibus. Praesent sed magna eros.");