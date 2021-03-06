export async function registerUser(inputs) {
  const body = inputs;
  const res = await fetch(
    "http://localhost:5000/auth/register",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const parseRes = await res.json();
  
  return parseRes;
}

export async function loginUser(inputs) {
  const body = inputs;
  const res = await fetch(
    "http://localhost:5000/auth/login",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const parseRes = await res.json();

  return parseRes;
}

export async function clinicianProfile() {
  let res = await fetch("http://localhost:5000/dashboard/", {
    method: "POST",
    headers: { jwt_token: localStorage.token }
  });
  
  const clinicianInfo = await res.json();
  
  res = await fetch("http://localhost:5000/myPatients", {
    method: "POST",
    headers: { jwt_token: localStorage.token }
  });

  const myPatients = await res.json();

  return {clinician: clinicianInfo, patients: myPatients};
}

export async function submitTreatmentPlan(inputs, patient_id) {
  const body = { ...inputs, patient_id, modified_time: new Date().toLocaleString() };

  const res = await fetch(
    "http://localhost:5000/patientInfo/changeTreatmentPlan",
    {
      method: "POST",
      headers: {
        jwt_token: localStorage.token, 
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const parseRes = await res.json();

  return parseRes;
}

export async function patientPlan(patient_id) {
  const res = await fetch(`http://localhost:5000/patientInfo/treatmentPlan?id=${patient_id}`, {
    method: "POST",
    headers: { jwt_token: localStorage.token }
  });

  const parseRes = await res.json();
  return parseRes;
}

export async function patientProfile(patient_id) {
  const res = await fetch(`http://localhost:5000/dashboard/?id=${patient_id}`, {
    method: "POST",
    headers: { jwt_token: localStorage.token }
  });
  // why dont I just get the "full info"?
  const patientBaseInfo = await res.json();

  const patientTreatmentPlan = await patientPlan(patient_id);

  return { info: patientBaseInfo, plan: patientTreatmentPlan };
}

export async function allPatients() {
  const res = await fetch("http://localhost:5000/myPatients/getAll", {
    method: "POST",
    headers: { jwt_token: localStorage.token }
  });
  const parseRes = await res.json();

  return parseRes;
}

export async function submitAddPatients(myPatients) {
  const res = await fetch(
    "http://localhost:5000/myPatients/add",
    {
      method: "POST",
      headers: { 
        jwt_token: localStorage.token, 
        "Content-type": "application/json"
      },
      body: JSON.stringify(myPatients)
    }
  );
  const parseRes = await res.json();
  
  return parseRes;
}

export async function getPatientFeeds(patient_id) {
  const res = await fetch("http://localhost:5000/getFeeds", {
    method: "POST",
    headers: {
      jwt_token: localStorage.token,
      "Content-type": "application/json"
    },
    body: JSON.stringify({patient_id})
  });
  let parseRes = await res.json();

  return parseRes;
}

export async function patientInfo(patient_id) {
  const res = await fetch(`http://localhost:5000/patientInfo/?id=${patient_id}`, {
    method: "POST",
    headers: { jwt_token: localStorage.token,
      "Content-type": "application/json"
    }
  });
  const patientFullInfo = await res.json();
  const patientTreatmentPlan = await patientPlan(patient_id);
  
  return { info: patientFullInfo, plan: patientTreatmentPlan };
} 