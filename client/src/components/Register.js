import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { registerUser } from "../api/fetches";
import { useInput, useTextArea } from "../useInput";
import RainbowDatepicker from "./DatePicker";

import Grid from '@material-ui/core/Grid';
import { useStylesReg } from "../styles/styles";

const Register = ({ logout }) => {
  const classes = useStylesReg();

  const [email, emailField] = useInput({placeholder: "email *"});
  const [password, passwordField] = useInput({type:"password", placeholder:"password *"});
  const [confPassword, confPasswordField] = useInput({type:"password", placeholder:"confirm password *"});
  const [name, nameField] = useInput({placeholder:"name *"});
  const [dob, setDOB] = useState(null);
  const [diagnosticConclusion, diagnosisField] = useTextArea({placeholder:"diagnostic conclusion *"});
  const [description, descriptionField] = useInput({placeholder: "Treatment plan description *"});
  const [target_feed_fluid, targetFluidField] = useInput({placeholder: "Target Feed Fluid *"});
  const [target_feed_energy, targetEnergyField] = useInput({placeholder: "Target Energy Intake (kcal/day) *"});
  const [weight, weightField] = useInput({placeholder:"weight *"});
  const [role, setRole] = useState("Patient");
  const [gender, setGender] = useState("Male");
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await registerUser({email, password, confPassword, name, role, dob, gender, diagnosticConclusion, weight}, { description, target_feed_fluid, target_feed_energy, modified_time: new Date()});
      if (parseRes.jwtToken) {
        toast.success(`Successfully Registered ${role} ${name}`);
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const formatDate = (date) => {
    if (date != null) {
      let newDate = date.toLocaleDateString().split("/");
      date = new Date(parseInt(newDate[2]), parseInt(newDate[1])-1, parseInt(newDate[0]));
    }
    return date;
  }

  return (
    <Grid container component="main" direction="row" justify="center">
      <Grid item sm={4} md={1} />
      <Grid item xs={12} sm={8} md={5} style={{margin: 30}}>
        <div className={classes.paper}>
          <h1 className="text-center">Register</h1>
          <form className={classes.form} onSubmit={onSubmitForm}>
            <h5>Basic Information:</h5>
            {emailField}
            {passwordField}
            {confPasswordField}
            {nameField}
            <select name="role" className="form-control mt-4 mb-4" style={{maxWidth: 110}} value={role} onChange={e => setRole(e.target.value)}>
              <option value="Patient">Patient</option>
              <option value="Clinician">Clinician</option>
            </select>
           
            {role==="Clinician"? null : (
              <>
                <select name="gender" className="form-control mb-4" style={{maxWidth: 100}} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <RainbowDatepicker dates={formatDate(dob)} setDates={setDOB} single={true} />
                {weightField}
                <div className="mt-4" /> 
                {diagnosisField}
                <h5 className="mt-5">Treatment Plan:</h5>
                {descriptionField}
                {targetFluidField}
                {targetEnergyField}
              </>
              )
            }   
            <button type="submit" className="btn btn-success btn-block mt-5">Submit</button>
            <button onClick={logout} className="btn btn-info mt-4">Logout From Admin</button>
            <button onClick={() => window.location.reload()} className="btn btn-danger mt-4 ml-3">Clear Fields</button>

          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={4} className={classes.image} style={{marginLeft: 30}} />
    </Grid>
  );
};

export default Register;
