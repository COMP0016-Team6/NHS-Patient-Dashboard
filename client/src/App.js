import React, { Fragment, useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { toast } from "react-toastify";

//components

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ClinicianDashboard from "./components/ClinicianDashboard";
import PatientDashboard from "./components/PatientDashboard";
import PatientInfo from "./components/PatientInfo";
import AddPatients from "./components/AddPatients";


toast.configure();

function App() {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      // user_id, user_name, user_email, user_role
      const parseRes = await res.json();
      parseRes.auth === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      
      // { user_id: , user_name: , user_email: , user_role: }
      // console.log(parseRes.user);
      parseRes.user.user_role === "Clinician"? setIsClinician(true) : setIsClinician(false);

    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClinician, setIsClinician] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out Successfully");
    setIsAuthenticated(false);
    setIsClinician(false);
  } 

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/login"
              render={props =>
                !isAuthenticated ? (
                  <Login {...props} setAuth={setIsAuthenticated} setIsClinician={setIsClinician} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/register"
              render={props =>
                !isAuthenticated ? (
                  <Register {...props} setAuth={setIsAuthenticated} setIsClinician={setIsClinician} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/dashboard"
              render={props =>
                isAuthenticated ? (
                  !isClinician? (<Dashboard {...props} logout={logout} />) : (<ClinicianDashboard {...props} logout={logout} />)
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              exact
              path="/addPatients"
              render={props =>
                isAuthenticated ? (
                  !isClinician? (<Dashboard {...props} logout={logout} />) : (<AddPatients {...props} />)
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              path="/dashboard/:id"
              render={props => // tbh dont know what that props does and why i need to {...props below}, and why it doesnt work otherwise 
                // TODO: CHECK IF THE CLINICIAN SUPERVISES THE PATIENT AT ALL, IF NO, DONT LET IT ACCESS IT!
                
                isAuthenticated ? <PatientDashboard {...props} /> : <Redirect to="/login" />
              }
            />

          {/* need patientInfo/:id! */}
            <Route
              path="/patientInfo/:id"
              render={props => // tbh dont know what that props does and why i need to {...props below}, and why it doesnt work otherwise 
                // TODO: CHECK IF THE CLINICIAN SUPERVISES THE PATIENT AT ALL, IF NO, DONT LET IT ACCESS IT!
                
                isAuthenticated ? <PatientInfo {...props} /> : <Redirect to="/login" />
              }
            />

          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;