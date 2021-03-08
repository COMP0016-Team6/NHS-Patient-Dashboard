import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/fetches";
import { loggedIn, loggedOut } from "../state/action";
import { useInput } from "../useInput";

const Register = () => {
  const dispatch = useDispatch();
  const [email, emailField] = useInput({placeholder: "email"});
  const [password, passwordField] = useInput({type:"password", placeholder:"password"});
  const [name, nameField] = useInput({placeholder:"name"});
  const [age, ageField] = useInput({placeholder:"age"});
  const [diagnosticConclusion, diagnosisField] = useInput({placeholder:"diagnostic conclusion"});
  const [weight, weightField] = useInput({placeholder:"weight"});
  const [role, setRole] = useState("Patient");
  const [gender, setGender] = useState("Male");

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await registerUser({email, password, name, role, age, gender, diagnosticConclusion, weight});
      
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
            // HANDLE THESE! Store those in the patients table, make sure the onchange works and Later verify the values of inputs
            // make the diagnostic conclusion input a text box
            <>
              {ageField}
              {weightField}

              <select name="gender" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {/** Make this an extendable text box */}
              {diagnosisField}
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
