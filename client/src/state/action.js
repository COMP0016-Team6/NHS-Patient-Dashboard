export function loggedIn(user_role, user_id = 0, user_name, user_email) {
  return { type: "LOGGED_IN", user_role, user_id, user_name, user_email };
}

export function loggedOut() {
  return { type: "LOGGED_OUT" };
}

export function clinicianProfile(patients, allPatients) {
  return { type: "CLINICIAN_PROFILE", patients, allPatients };
}

export function patientProfile(allInfo) {
  return { type: "PATIENT_PROFILE", allInfo };
}

export function setClinicianPatients(patients) {
  return { type: "SET_CLINICIAN_PATIENTS", patients };
}

export function changedWeight(weight) {
  return { type: "CHANGED_WEIGHT", weight};
}