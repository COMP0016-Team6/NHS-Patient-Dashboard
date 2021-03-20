const fetch = require("node-fetch");
const jwtGenerator = require("../utils/jwtGenerator");

describe("test-myPatients-route", () => {
  const jwt = jwtGenerator(1);
  it ("getAll route", async() => {
    const res = await fetch("http://localhost:5000/myPatients/getAll", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-type": "application/json"
        }
      });
    
      let parseRes = await res.json();
      expect(parseRes[0].user_email).toEqual("test.user.two@gmail.com");
      expect(parseRes[1].user_email).toEqual("test.user.three@gmail.com");
  });
  
  it("no patients", async() => {
    const res = await fetch("http://localhost:5000/myPatients", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-type": "application/json"
      }
    });

    let parseRes = await res.json();
    expect(parseRes).toEqual([]);
  });

  it("add patients", async() => {
    const res = await fetch("http://localhost:5000/myPatients/add", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify([{ user_id: 2 }, { user_id: 3 }])
    });

    let parseRes = await res.json();
    expect(parseRes.result).toEqual("success");
  });

  it("my patients - expect two", async() => {
    const res = await fetch("http://localhost:5000/myPatients", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-type": "application/json"
      }
    });


    let parseRes = await res.json();

    expect(parseRes[0].user_email).toEqual("test.user.two@gmail.com");
    expect(parseRes[1].user_email).toEqual("test.user.three@gmail.com");
  });
})