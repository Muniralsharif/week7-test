


BEGIN;

    DROP TABLE IF EXISTS city,users
    CASCADE;

CREATE TABLE city
(
    id SERIAL PRIMARY KEY,
    name VARCHAR (150) NOT NULL,
    country VARCHAR (150) NOT NULL
);
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name VARCHAR (150),
    email VARCHAR (150) NOT NULL UNIQUE,
    password VARCHAR (150) NOT NULL
);




INSERT INTO city
    (name,country)
VALUES
    ('Jerusalem', 'Palestine'),
    ('Haifa','Palestine'),
    ('Gaza' , 'Palestine');



COMMIT;
