import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changedWeight } from "../state/action";
import TreatmentHistory from "./TreatmentHistory";
import { Link } from "react-router-dom";
import { changeWeight } from "../api/fetches";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useStylesUser } from "../styles/styles";
import NavBar from "./Navbar";

toast.configure();

const PatientInfo = ({ logout }) => {
  const classes = useStylesUser();
  const dispatch = useDispatch();
  const treatmentPlan = useSelector(state => state.patientPlan);
  const isClinician = useSelector(state => state.isClinician);
  const patientInfo = useSelector(state => state.patientInfo);

  const { user_id, user_name, user_email, patient_gender, patient_dob, diagnostic_conclusion, weight } = patientInfo;

  const [isChangeWeight, setChangeWeight] = useState(false);
  const [newWeight, setWeight] = useState(weight);

  const changePatientWeight = async () => {
    try {
      const parseRes = await changeWeight({ user_id, newWeight });

      if (parseRes === "Success") {
        dispatch(changedWeight(newWeight));
        toast.success("Weight Change Successful");
        setChangeWeight(false);
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  
  function calcAge(dateString) {
    let YEARLEN = 31557600000;
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (YEARLEN));
  }

  return (
    <div className={classes.root}>
      <NavBar heading="" logout={logout}/>
      
      <div style={{width: "75%", justify: "center", alignItems: "center", margin: "auto"}}>
          {isClinician? (<Link to={`/dashboard/${user_id}`}> <button className="btn btn-primary mt-5">Back</button> </Link>)
            : (<Link to={`/dashboard`}> <button className="btn btn-primary mt-5">Back</button> </Link>)}

          <div className="mt-5">
            <h2 className="text-info mt-5">Patient Name: {user_name}</h2>
            <h2>Email Address: {user_email} </h2>
            <h2>Date of Birth: {new Date(patient_dob).toLocaleDateString()} ({calcAge(patient_dob)} years)</h2>
            <h2>Gender: {patient_gender}</h2>
            <h4>Diagnostic Conclusion: {diagnostic_conclusion}</h4>
            {!isChangeWeight? 
            <div>
            <div style={{display: "inline-block"}}><h4>Weight: {weight}</h4></div> <div style={{display: "inline-block", marginLeft: 10}}><button type="submit" className="btn btn-info" onClick={()=>setChangeWeight(true)}>Change Weight</button></div>
            </div>
            : <div>
                <h4> Weight:</h4>
                <input type="text" value={newWeight} placeholder="weight" onChange={e => setWeight(e.target.value)} className="form-control my-3"/>
                <button type="submit" className="btn btn-success" onClick={changePatientWeight} >Change Weight</button>
                <button type="submit" className="btn btn-danger ml-2" onClick={()=>{setWeight(weight); setChangeWeight(false)}}>Cancel</button>
              </div>
            }
            <h4>Treatment History: </h4>
            <div className="mb-5">
              {treatmentPlan.length === 0? null : 
              <TreatmentHistory treatmentPlan={treatmentPlan} />
              }
            </div>
          </div>
      </div>
    </div>
  )
}

export default PatientInfo;