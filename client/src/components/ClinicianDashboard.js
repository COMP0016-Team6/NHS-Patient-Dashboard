import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clinicianProfile } from "../state/action";
import { useSelector, useDispatch } from "react-redux";
import { cliniciansProfile, allPatients } from "../api/fetches";
import SearchBar from "../components/SearchBar";
import { Grid } from '@material-ui/core';
import { useStylesUser } from "../styles/styles";
import NavBar from "./Navbar";

const ClinicianDashboard = ({ logout }) => {
  const classes = useStylesUser();
  const dispatch = useDispatch();
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
    <div className={classes.root}>
      <NavBar heading="Welcome, Clinician" logout={logout}/>
      <h1 className="text-center mt-5 mr-5 mb-4">My Patients</h1>
      
      <Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
        <Grid item md={3}/>
        <Grid item md> 
          <SearchBar />
        </Grid>
        <Grid item md>
          <Link to="/addPatients">
            <button className="btn btn-primary mt-3 mr-5">Add Patients</button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default ClinicianDashboard;
