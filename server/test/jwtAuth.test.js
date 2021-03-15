const pool = require("../db");
const fetch = require("node-fetch");

describe("test-register-route", () => {
  it("register a clinician", async () => {

    let res = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ inputs: { email: "test.user.one@gmail.com", password: "useronepassword", name: "Test User One", role: "Clinician" }, plan: {} })
        }
    );

    const parseRes = await res.json();
    
    expect(parseRes.jwtToken).not.toBeUndefined();
    expect(parseRes.user.user_email).toEqual("test.user.one@gmail.com");
  });

  it("register a patient", async () => {
    let res = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ inputs: 
            { email: "test.user.two@gmail.com", password: "usertwopassword", name: "Test User Two", role: "Patient", dob:  '2000-01-03 00:00:00', gender: "Male", diagnosticConclusion: 'Lung Cancer I', weight: "70"}, 
            plan: { description: "test", target_feed_volume: "1.5", target_feed_energy: "2.5", modified_time: '2020-05-05 20:20:20' } })
        }
    );

    const parseRes = await res.json();
    expect(parseRes.jwtToken).not.toBeUndefined();
    expect(parseRes.user.user_role).toEqual("Patient");
    expect(parseRes.user.user_email).toEqual("test.user.two@gmail.com");
    
    await pool.query("INSERT INTO feed (patient_id, volume, energy, timestamp) VALUES (2, '1', '2', '2020-05-07 20:20:20');");
    await pool.query("INSERT INTO feed (patient_id, volume, energy, timestamp) VALUES (2, '0.5', '1.5', '2020-05-10 20:20:20');");

  });

  it("register a patient 2", async () => {
    let res = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ inputs: 
            { email: "test.user.three@gmail.com", password: "userthreepassword", name: "Test User Three", role: "Patient", dob:  '2002-05-01 00:00:00', gender: "Female", diagnosticConclusion: 'Breast Cancer II', weight: "50"}, 
            plan: { description: "test", target_feed_volume: "2.5", target_feed_energy: "2.0", modified_time: '2020-01-03 20:20:20' } })
        }
    );

    const parseRes = await res.json();
    expect(parseRes.jwtToken).not.toBeUndefined();
    expect(parseRes.user.user_role).toEqual("Patient");
    expect(parseRes.user.user_email).toEqual("test.user.three@gmail.com");
    
    await pool.query("INSERT INTO feed (patient_id, volume, energy, timestamp) VALUES (3, '2', '2', '2020-01-07 20:20:20');");
    await pool.query("INSERT INTO feed (patient_id, volume, energy, timestamp) VALUES (3, '2.5', '1.5', '2020-01-10 20:20:20');");
  })
})


describe("test-login-route", () => {
  it("success login", async () => {
    const res = await fetch(
      "http://localhost:5000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({email: "test.user.two@gmail.com", password: "usertwopassword"})
      }
    );
  
    const parseRes = await res.json();
    expect(parseRes.jwtToken).not.toBeUndefined();
  });

  it("fail login", async () => {
    const res = await fetch(
      "http://localhost:5000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({email: "test.user.three@gmail.com", password: "usertwopassword"})
      }
    );
  
    const parseRes = await res.json();
    expect(parseRes.jwtToken).toBeUndefined();
  })
}) 