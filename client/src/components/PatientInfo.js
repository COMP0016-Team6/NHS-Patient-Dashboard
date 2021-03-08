import React, { useState } from "react";
import { useSelector } from "react-redux";
import TreatmentHistory from "./TreatmentHistory";

const PatientInfo = () => {
  const treatmentPlan = useSelector(state => state.patientPlan);
  const patientInfo = useSelector(state => state.patientInfo);
  const { patient_id, patient_name, patient_email, patient_gender, patient_age, diagnosis, patient_weight } = patientInfo;

  // after updating you can say "The weight will soon be changed..."
  const [isChangeWeight, setChangeWeight] = useState(false);
  const [weight, setWeight] = useState(patient_weight);

  const changeWeight = async () => {
    try {
      const res = await fetch(`http://localhost:5000/patientInfo/changeWeight`, {
        method: "POST",
        headers: { 
          jwt_token: localStorage.token,
          "Content-type": "application/json"
        },
        body: JSON.stringify({ patient_id, weight })
      });
      // new redux action to?
      setChangeWeight(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  // edit the returning jsx
  return (
    <>
      {
      // info == initialInfo? null :
      // (
        <div className="mt-5">
          <h2 className="text-info mt-5">Patient Name: {patient_name}</h2>
          <h2>Email Address: {patient_email} </h2>
          <h2>Age: {patient_age}</h2>
          <h2>Gender: {patient_gender}</h2>
          <h4>Diagnostic Conclusion: {diagnosis}</h4>
          {!isChangeWeight? 
          <div><h4>Weight: {weight}</h4> <button type="submit" className="btn btn-info" onClick={()=>setChangeWeight(true)}>Change Weight</button></div>
          : <div>
              <h4> Weight:</h4>
              <input type="text" name="weight" value={weight} placeholder="weight" onChange={e => setWeight(e.target.value)} className="form-control my-3"/>
              <button type="submit" className="btn btn-success" onClick={changeWeight} >Change Weight</button>
              <button type="submit" className="btn btn-danger ml-2" onClick={()=>setChangeWeight(false)}>Cancel</button>
            </div>
          }
          <h4>Treatment History: </h4>
          <div style={{maxWidth: 800, maxHeight: 600}}>
          {treatmentPlan.length === 0? null : 
          <TreatmentHistory treatmentPlan={treatmentPlan} />
          }
          </div>
        </div>
      // ) 
      }
    </>
  )
}

export default PatientInfo;