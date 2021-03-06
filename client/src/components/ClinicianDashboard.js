import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { clinicianProfile } from "../api/fetches";
import SearchBar from "../components/SearchBar";

const ClinicianDashboard = ({ logout, patients, setPatients }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const parseRes = await clinicianProfile();
        if (!cancelled) {
          setName(parseRes.clinician.user_name);
          setEmail(parseRes.clinician.user_email);
          setPatients(parseRes.patients);
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
      <h5 className="mt-5 text-success">Clinician {name}</h5>
      <h1 className="mb-5">My Patients</h1>
      
      <SearchBar patients={patients} />
      
      <Link to="/addPatients">
        <button className="btn btn-primary mt-5 mr-5">Add Patients</button>
      </Link>

      <button onClick= {logout} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default ClinicianDashboard;
