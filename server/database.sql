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

-- think about moving the target energy from treatments to feed
CREATE TABLE feed (
  id BIGSERIAL PRIMARY KEY,
-- TODO! SHOULD BE THIS:  patient_id INT REFERENCES patients(patient_id) NOT NULL,
-- IN THE MEANTIME WORK WITH THIS:
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
  -- patients_scope: the id of the patient this clinician treats
  patients_scope INT REFERENCES users(user_id) NOT NULL,
  PRIMARY KEY(user_id, patients_scope)
);

CREATE TABLE weights (
  patient_id INT REFERENCES users(user_id) NOT NULL,
  weight float8 NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

-- think about each patient having a "main" clinician who will be able to grant access to view/edit to other clinicians
