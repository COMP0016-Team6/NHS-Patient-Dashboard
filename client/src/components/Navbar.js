import React from "react";
import { AppBar, Toolbar } from '@material-ui/core';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useStylesUser } from "../styles/styles";

export default function NavBar({ heading, logout, isClinician = true, patient_id }) {
  const classes = useStylesUser();
  const name = useSelector(state => state.user_name);
  
  return (
    <AppBar position="static" style={{background: "#066bdd"}}>
      <Toolbar>
        {isClinician? <h4 className={classes.title}>{heading} {name}</h4> : 
          <h4 className={classes.title}><Link to={`/patientInfo/${patient_id}`} style={{color: "#ffffff", textDecorationLine: "underline"}}>My Information</Link></h4>
        }
        <button onClick={logout} className="btn btn-info">Logout</button>
      </Toolbar>
    </AppBar>
  )
}