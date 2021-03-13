import React from "react";
import { AppBar, Toolbar } from '@material-ui/core';
import { useSelector } from "react-redux";
import { useStylesUser } from "../styles/styles";

export default function NavBar({ heading, logout }) {
  const classes = useStylesUser();
  const name = useSelector(state => state.user_name);
  
  return (
    <AppBar position="static" style={{background: "#066bdd"}}>
      <Toolbar>
        <h4 className={classes.title}>{heading} {name}</h4>
        <button onClick={logout} className="btn btn-info">Logout</button>
      </Toolbar>
    </AppBar>
  )
}