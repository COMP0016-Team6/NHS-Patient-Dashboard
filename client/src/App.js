import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loggedIn, loggedOut } from "./state/action";

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
import ClinicianDashboard from "./components/ClinicianDashboard";
import PatientDashboard from "./components/PatientDashboard";
import PatientInfo from "./components/PatientInfo";
import AddPatients from "./components/AddPatients";

toast.configure();

function App() {

  const isAuth = useSelector(state => state.isAuth);
  const isClinician = useSelector(state => state.isClinician);  
  const dispatch = useDispatch();

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json(); // user_id, user_name, user_email, user_role
      const user = parseRes.user;
      parseRes.auth === true ? dispatch(loggedIn(user.user_role, user.user_id, user.user_name, user.user_email)) : dispatch(loggedOut());
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const auth = async() => await checkAuthenticated();
    auth();
  }, []);

  // should I still keep passing this as a prop?
  // or is there a nice way around it?
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out Successfully");
    dispatch(loggedOut());
  } 

  return (
    <>
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path="/login"
              render={ props => !isAuth? <Login {...props} /> : <Redirect to="/dashboard" /> }
            />
            <Route
              exact
              path="/register"
              render={ props => !isAuth? <Register {...props} /> : <Redirect to="/dashboard" /> }
            />
            <Route
              exact
              path="/dashboard"
              render={ props =>
                isAuth? (
                  !isClinician? <PatientDashboard {...props} logout={logout} /> : <ClinicianDashboard {...props} logout={logout} />
                ) : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/addPatients"
              render={ props =>
                isAuth? (
                  !isClinician? <PatientDashboard {...props} logout={logout} /> : <AddPatients {...props} logout={logout} />
                ) : <Redirect to="/login" />
              }
            />
            <Route
              path="/dashboard/:id"
              // tbh dont know what that props does and why i need to {...props below}, and why it doesnt work otherwise 
              render={ props => isAuth? <PatientDashboard {...props} logout={logout} /> : <Redirect to="/login" /> }
            />
            <Route
              path="/patientInfo/:id"
              // tbh dont know what that props does and why i need to {...props below}, and why it doesnt work otherwise 
              render={ props => isAuth? <PatientInfo {...props} logout={logout} /> : <Redirect to="/login" /> }
            />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;