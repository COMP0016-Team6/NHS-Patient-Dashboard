CREATE DATABASE login;

CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  UNIQUE (user_email)
);
