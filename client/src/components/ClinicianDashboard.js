import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import SearchBar from "../components/SearchBar";

const ClinicianDashboard = ({ logout, patients, setPatients }) => {
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

  useEffect(() => {
    let cancelled = false;

    const getPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/myPatients", {
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

  return (
    <div>
      <h5 className="mt-5 text-success">Clinician {name} </h5>
      <h1 className="mb-5">My Patients</h1>
      
      <SearchBar patients={patients} />
      {/*myPatients*/}
      <Link to="/addPatients">
        <button className="btn btn-primary mt-5 mr-5"> Add Patients </button>
      </Link>
      <button onClick= {logout} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default ClinicianDashboard;