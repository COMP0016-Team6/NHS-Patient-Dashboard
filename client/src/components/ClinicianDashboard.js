import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const ClinicianDashboard = ({ logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [patients, setPatients] = useState([]);
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

  useEffect(() => {
    let cancelled = false;

    const getPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/getPatients/", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        console.log(parseData);
        if (!cancelled) {
          setPatients(parseData);
        }
      } catch(err) {
        console.error(err.message);
      }
    }
    getPatients();
    return () => cancelled = true; 
  }, [])

  let myPatients = [];
  for (var i = 0; i < patients.length; i++) {
    myPatients.push(<h3 key={i} className="text-info"><Link to={`/dashboard/${patients[i].user_id}`}>{patients[i].user_name}'s Dashboard</Link></h3>)
  }
  

  return (
    <div>
      <h1 className="mt-5">Hi Clinician {name}, </h1>
      <h1 className="text-success">My Patients</h1>
      {myPatients}
      {/*<Linechart />*/}
      <button onClick= {logout} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default ClinicianDashboard;