CREATE DATABASE list_db;

CREATE TABLE list (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(256) NOT NULL,
    link VARCHAR(256) NOT NULL
);