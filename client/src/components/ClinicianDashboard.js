import React, { useEffect, useState } from "react";

const ClinicianDashboard = ({ logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          setName(parseData.user_name);
          setEmail(parseData.user_email);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, []);

  return (
    <div>
      <h1 className="mt-5">CLINICIAN dashboard</h1>
      <h2 className="mt-5">{name}</h2>
      <h2>{email}</h2>
      {/*<Linechart />*/}
      <button onClick= {logout} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default ClinicianDashboard;