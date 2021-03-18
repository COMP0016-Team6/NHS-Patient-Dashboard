const fetch = require("node-fetch");
const jwtGenerator = require("../utils/jwtGenerator");

describe("test-patientInfo-route", () => {
  const jwt = jwtGenerator(2)
  it ("get user two info", async() => {
    const res = await fetch("http://localhost:5000/patientInfo/?id=2", {
        method: "POST",
        headers: {
          jwt_token: jwt,
          "Content-type": "application/json"
        }
      });
    
      let parseRes = await res.json();
      expect(parseRes.info.user_email).toEqual("test.user.two@gmail.com");
      expect(parseRes.info.diagnostic_conclusion).toEqual("Lung Cancer I");
      expect(parseRes.info.patient_gender).toEqual("Male");
      expect(parseRes.weight).toEqual(70);
  });
  
  it("get treatment plan", async() => {
    const res = await fetch("http://localhost:5000/patientInfo/treatmentPlan?id=2", {
      method: "POST",
      headers: {
        jwt_token: jwt,
        "Content-type": "application/json"
      }
    });
    let parseRes = await res.json();

    expect(parseRes).not.toEqual([]);
    expect(parseRes[0].description).toEqual("test");
  });

  it("change treatment plan", async() => {
    const res = await fetch(
      "http://localhost:5000/patientInfo/changeTreatmentPlan",
      {
        method: "POST",
        headers: {
          jwt_token: jwt, 
          "Content-type": "application/json"
        },
        body: JSON.stringify({ patient_id: 2, description: "test 2", target_feed_fluid: 2, target_feed_energy: 2, modified_time: new Date() })
      }
    );
    let parseRes = await res.json();
    expect(parseRes).toEqual("Success");
  });

  it("change weight", async() => {
    const res = await fetch(`http://localhost:5000/patientInfo/changeWeight`, {
        method: "POST",
        headers: { 
          jwt_token: jwt,
          "Content-type": "application/json"
        },
        body: JSON.stringify({ user_id: 2, newWeight: 65 })
      });
    
      let parseRes = await res.json();
      expect(parseRes).toEqual("Success");
  });
})