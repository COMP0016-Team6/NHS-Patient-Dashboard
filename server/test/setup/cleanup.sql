DO $$ DECLARE
    tabname RECORD;
BEGIN
    FOR tabname IN (SELECT tablename 
                    FROM pg_tables 
                    WHERE schemaname = current_schema()) 
LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(tabname.tablename) || ' CASCADE';
END LOOP;
END $$;


CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL
);


CREATE TABLE patients (
  patient_id INT REFERENCES users(user_id) NOT NULL,
  patient_gender VARCHAR(50) NOT NULL,
  patient_dob TIMESTAMP NOT NULL,
  diagnostic_conclusion VARCHAR(1000) NOT NULL,
  PRIMARY KEY(patient_id)
);


CREATE TABLE treatments (
  id BIGSERIAL PRIMARY KEY,
  patient_id INT REFERENCES users(user_id) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  target_feed_fluid float8 NOT NULL,
  target_feed_energy float8 NOT NULL,
  modified_time TIMESTAMP NOT NULL
);

CREATE TABLE feed (
  id BIGSERIAL PRIMARY KEY,
  patient_id INT REFERENCES users(user_id) NOT NULL,
  fluid float8 NOT NULL,
  energy float8 NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  patient_feedback VARCHAR(255)
);

CREATE TABLE user_perms (
  user_id INT REFERENCES users(user_id) NOT NULL,
  read BOOLEAN NOT NULL,
  write BOOLEAN NOT NULL,
  patients_scope INT REFERENCES users(user_id) NOT NULL,
  PRIMARY KEY(user_id, patients_scope)
);

CREATE TABLE weights (
  patient_id INT REFERENCES users(user_id) NOT NULL,
  weight float8 NOT NULL,
  timestamp TIMESTAMP NOT NULL
);