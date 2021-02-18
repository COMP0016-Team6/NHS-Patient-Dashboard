CREATE DATABASE application;

CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL
);

-- Patient Details

CREATE TABLE patients (
  patient_id INT REFERENCES users(user_id) NOT NULL,
  patient_gender VARCHAR(50) NOT NULL,
  patient_age INT NOT NULL,
  diagnostic_conclusion VARCHAR(1000) NOT NULL,
  PRIMARY KEY(patient_id)
);


-- Store all the feeds from the infusion pump for each patient

-- What are the alternatives? The feed data will be huge, I need to store it over the years and
-- new data is added every 30 min for EACH patient. 

-- Should I store an array for values and an array for corresponding date/time?

-- ANS: I think storing json would be perfect


CREATE TABLE treatments (
  id BIGSERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  target_feed_volume float8 NOT NULL,
  target_feed_rate float8 NOT NULL
);

-- think about moving the target rate from treatments to feed
CREATE TABLE feed (
  id BIGSERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id) NOT NULL,
  volume float8 NOT NULL,
  rate float8 NOT NULL,
  feed_timestamp TIMESTAMP NOT NULL
);

CREATE TABLE user_perms (
  user_id INT REFERENCES users(user_id) NOT NULL,
  read BOOLEAN NOT NULL,
  write BOOLEAN NOT NULL,
  patients_scope INT REFERENCES users(user_id) NOT NULL,
  PRIMARY KEY(user_id, patients_scope)
);


-- think about each patient having a "main" clinician who will be able to grant access to view/edit to other clinicians
