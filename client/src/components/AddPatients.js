import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { submitAddPatients } from "../api/fetches";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const ColorButton = withStyles(() => ({
  root: {
    backgroundColor: blue[700],
    '&:hover': {
      backgroundColor: blue[900],
    },
  },
}))(Button);

const AddPatients = ({ logout }) => {
  const allPatients = useSelector(state => state.allPatients);
  const myPatients = useSelector(state => state.patients);
  const classes = useStyles();

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
      <AppBar position="static">
        <Toolbar> 
          <Typography variant="h6" className={classes.title}>
            Add Patients
          </Typography>
          <Button onClick= {logout} color="inherit"><ExitToAppOutlinedIcon className="mr-1"/>Logout</Button>          
        </Toolbar>
      </AppBar>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item md={8}>
          <Link to="/dashboard">
            <ColorButton type="submit" variant="contained" color="primary" className={classes.submit, "mt-5 mb-5"}>
              <ArrowLeftIcon/>Back
            </ColorButton>
          </Link>
        </Grid>
      </Grid>
      <h1 className="text-center">Add Patients</h1>
      <form className="mt-5" onSubmit={onSubmitForm}>
        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
          <Grid item md={6}> <SearchBar select={true}/></Grid>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
        <Grid md={6}>
          <ColorButton type="submit" variant="contained" color="primary" fullWidth className={classes.submit, "mt-5 mb-5"}>
            Submit
          </ColorButton>
          </Grid>
        </Grid>  
      </form>
    </div>
  )
}

export default AddPatients;