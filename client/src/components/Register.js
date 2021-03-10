import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/fetches";
import { loggedIn, loggedOut } from "../state/action";
import { useInput } from "../useInput";
import RainbowDatepicker from "./DatePicker";


const Register = () => {
  const dispatch = useDispatch();
  const [email, emailField] = useInput({placeholder: "email"});
  const [password, passwordField] = useInput({type:"password", placeholder:"password"});
  const [name, nameField] = useInput({placeholder:"name"});
  const [dob, setDOB] = useState(null);
  const [diagnosticConclusion, setDiagnosis] = useState("");
  const [description, descriptionField] = useInput({placeholder: "Treatment plan description"});
  const [target_feed_volume, targetVolField] = useInput({placeholder: "Target Feed Volume"});
  const [target_feed_energy, targetEnergyField] = useInput({placeholder: "Target Energy Intake (kcal/day)"});
  const [weight, weightField] = useInput({placeholder:"weight"});
  const [role, setRole] = useState("Patient");
  const [gender, setGender] = useState("Male");
  
  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await registerUser({email, password, name, role, dob, gender, diagnosticConclusion, weight}, { description, target_feed_volume, target_feed_energy, modified_time: new Date()});
      if (parseRes.jwtToken) {
        const user = parseRes.user;
        localStorage.setItem("token", parseRes.jwtToken);
        dispatch(loggedIn(user.user_role, user.user_id, user.user_name, user.user_email));
        toast.success("Registered Successfully");
      } else {
        dispatch(loggedOut());
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
    <>
      <h1 className="mt-5 text-center">Register</h1>
      <form onSubmit={onSubmitForm}>
        {emailField}
        {passwordField}
        {nameField}
        
        <select name="role" value={role} onChange={e => setRole(e.target.value)}>
          <option value="Patient">Patient</option>
          <option value="Clinician">Clinician</option>
        </select>
        
        {role==="Clinician"? null : (
            <>
              <RainbowDatepicker dates={formatDate(dob)} setDates={setDOB} single={true} />
              {weightField}

              <select name="gender" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <TextareaAutosize aria-label="empty textarea" value={diagnosticConclusion} onChange={(e) => setDiagnosis(e.target.value)} placeholder="diagnostic conclusion" />
              <h5>Treatment Plan:</h5>
              {descriptionField}
              {targetVolField}
              {targetEnergyField}
            </>
          )
        }   
        <button type="submit" className="btn btn-success btn-block mt-5">Submit</button>
      </form>
      <Link to="/login">login</Link>
    </>
  );
};

export default Register;
