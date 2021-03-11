import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clinicianProfile } from "../state/action";
import { useSelector, useDispatch } from "react-redux";
import { cliniciansProfile, allPatients } from "../api/fetches";
import SearchBar from "../components/SearchBar";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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

const ClinicianDashboard = ({ logout }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
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
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Hello, Clinician {name}
          </Typography>          
          <Button onClick= {logout} color="inherit"><ExitToAppOutlinedIcon className="mr-1"/>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <h1 className="text-center mt-5 mr-5 mb-4">My Patients</h1>
      
      <Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
        <Grid md={3}/>
        <Grid item md> 
          <SearchBar />
        </Grid>
         <Grid item md>
         <Link to="/addPatients">
          <ColorButton type="submit" variant="contained" color="primary" className={classes.submit, "mt-3"}>
            <PersonAddIcon className="mr-2"/>
            Add Patients
          </ColorButton>
         </Link>
         </Grid>
      </Grid>      
    </div>
  );
};

export default ClinicianDashboard;
