const fetch = require("node-fetch");
const jwtGenerator = require("../utils/jwtGenerator");

describe("test-getFeeds-route", () => {
  const jwt = jwtGenerator(2)
  it ("get user two feeds", async() => {
    const res = await fetch("http://localhost:5000/getFeeds", {
        method: "POST",
        headers: {
          jwt_token: jwt,
          "Content-type": "application/json"
        },
        body: JSON.stringify({patient_id: 2})
      });
    
      let parseRes = await res.json();
      expect(parseRes.feeds[0].volume).toEqual(1);
      expect(parseRes.feeds[0].energy).toEqual(2);
      expect(parseRes.feeds[1].volume).toEqual(0.5);
      expect(parseRes.feeds[1].energy).toEqual(1.5);
      expect(parseRes.weights[0].weight).toEqual(70);
  });
  
  it("add feedback to feed", async() => {
    const res = await fetch("http://localhost:5000/getFeeds/feedback", {
      method: "POST",
      headers: {
        jwt_token: jwt,
        "Content-type": "application/json"
      },
      body: JSON.stringify({ id: 1, feedback: "test" })
    });
    let parseRes = await res.json();

    expect(parseRes.patient_id).toEqual(2);
    expect(parseRes.patient_feedback).toEqual("test");
  })
})