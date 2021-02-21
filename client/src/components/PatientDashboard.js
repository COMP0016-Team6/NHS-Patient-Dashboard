import React, { useEffect, useState } from "react";
import Linechart from "./LineChart";

const PatientDashboard = ({ match }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/dashboard/?id=${match.params.id}`, {
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
      <h1 className="mt-5">{name}'s Dashboard</h1>
      <Linechart patient_id = {match.params.id}/>
    </div>
  );
};

export default PatientDashboard;