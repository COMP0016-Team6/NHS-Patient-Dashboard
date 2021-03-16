import React from "react";
import { Link } from "react-router-dom";
import { submitAddPatients } from "../api/fetches";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import { Grid } from '@material-ui/core';
import { useStylesUser } from "../styles/styles";
import NavBar from "./Navbar";

const AddPatients = ({ logout }) => {
  const classes = useStylesUser();
  const myPatients = useSelector(state => state.patients);

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await submitAddPatients(myPatients);
      if (parseRes.result === "success") {
        toast.success("Patients are successfully added!");
      } else {
        toast.success(parseRes);
      }
    } catch (err) {
        console.error(err.message);
    }
  };

  return (
    <div className={classes.root}>
      <NavBar heading="" logout={logout} />

      <Grid container justify="center" alignItems="center">
        <Grid item md={6}>
          <Link to="/dashboard">
            <button className="btn btn-primary mt-5">Back</button>
          </Link>
          <h1 className="text-center">Add Patients</h1>
        </Grid>
      </Grid>
    
      <form className="mt-3" onSubmit={onSubmitForm}>

      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item md={6}> <SearchBar select={true}/></Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid md={6}>
          <button className="btn btn-success btn-block mt-5">Submit</button>
        </Grid>
      </Grid> 
      </form>
    </div>
  )
}

export default AddPatients;