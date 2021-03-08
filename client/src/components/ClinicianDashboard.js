import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clinicianProfile } from "../state/action";
import { useSelector, useDispatch } from "react-redux";
import { cliniciansProfile, allPatients } from "../api/fetches";
import SearchBar from "../components/SearchBar";

const ClinicianDashboard = ({ logout }) => {
  const dispatch = useDispatch();
  const name = useSelector(state => state.user_name);
  const email = useSelector(state => state.user_email);
  const patients = useSelector(state => state.patients);

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const parseRes = await cliniciansProfile();
        const parseResAllPatients =  await allPatients();

        if (!cancelled) 
          dispatch(clinicianProfile(parseRes, parseResAllPatients));
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, []);

  if (patients===undefined) return null;
  
  return (
    <div>
      <h5 className="mt-5 text-success">Clinician {name}</h5>
      <h1 className="mb-5">My Patients</h1>
      
      <SearchBar />
      
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
