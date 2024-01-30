CREATE table sale (
    sale text not null,
    start_time timestamp not null default CURRENT_TIMESTAMP,
    end_time timestamp
);

INSERT INTO sale (sale) VALUES ('15% off all items');

UPDATE sale SET end_time=CURRENT_TIMESTAMP WHERE end_time IS NULL;

SELECT * FROM sale ORDER BY start_time DESC LIMIT 3;

CREATE table contacts (
    name text not null,
    email text not null,
    type text not null,
    deadline date not null,
    size int not null,
    id int not null
);

INSERT INTO contacts (name, email, type, deadline, size, id) values ("a", "b@umn.edu", "", "2000-01-01", 0, 0);

-- Any data added during testing have been cleaned --