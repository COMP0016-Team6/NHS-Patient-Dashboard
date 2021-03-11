export async function registerUser(inputs, plan) {
  let res = await fetch(
    "http://localhost:5000/auth/register",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ inputs, plan })
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

export async function cliniciansProfile() {
  const res = await fetch("http://localhost:5000/myPatients", {
    method: "POST",
    headers: { jwt_token: localStorage.token }
  });

  const parseRes = await res.json();
  
  return parseRes
}

export async function submitTreatmentPlan(inputs, patient_id) {
  // for Tianang we had to remove the .toLocaleString() and just with Date()
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

export async function patientAllInfo(patient_id) {
  const res = await fetch(`http://localhost:5000/patientInfo/?id=${patient_id}`, {
    method: "POST",
    headers: { jwt_token: localStorage.token,
      "Content-type": "application/json"
    }
  });
  const patientInfo = await res.json();
  let patientTreatmentPlan = await patientPlan(patient_id);
  for (var i = 0; i < patientTreatmentPlan.length; i++)
    patientTreatmentPlan[i].modified_time = new Date(patientTreatmentPlan[i].modified_time);

  let patientFeeds = await getPatientFeeds(patient_id);
  for (var i = 0; i < patientFeeds.feeds.length; i++)
    patientFeeds.feeds[i].timestamp = new Date(patientFeeds.feeds[i].timestamp);

  for (var i = 0; i < patientFeeds.weights.length; i++) 
    patientFeeds.weights[i].timestamp = new Date(patientFeeds.weights[i].timestamp);
 
  return { info: {... patientInfo.info, weight: patientInfo.weight}, plan: patientTreatmentPlan, feed: patientFeeds };
}

export async function addFeedback(feed_id, feedback) {
  const res = await fetch("http://localhost:5000/getFeeds/feedback", {
    method: "POST",
    headers: {
      jwt_token: localStorage.token,
      "Content-type": "application/json"
    },
    body: JSON.stringify({ id: feed_id, feedback })
  });
  let parseRes = await res.json();

  return parseRes;
};

export async function changeWeight(body) {
  const res = await fetch(`http://localhost:5000/patientInfo/changeWeight`, {
    method: "POST",
    headers: { 
      jwt_token: localStorage.token,
      "Content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  let parseRes = await res.json();

  return parseRes;
}