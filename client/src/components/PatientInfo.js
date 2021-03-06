import React, { useEffect, useState } from "react";
import { patientInfo } from "../api/fetches";
import TreatmentHistory from "./TreatmentHistory";

const PatientInfo = ({ match }) => {
  const initialInfo = {
    patient_name: "",
    patient_email: "",
    patient_gender: "",
    patient_age: "", // change to DOB
    diagnostic_conclusion: ""
  };

  const [treatmentPlan, setTreatmentPlan] = useState([])
  const patient_id = match.params.id;
  const [weight, setWeight] = useState(0);
  const [info, setInfo] = useState(initialInfo);
  const [isChangeWeight, setChangeWeight] = useState(false);

  useEffect (() => {
    let cancelled = false;
    const getPatientInfo = async() => {
      try {
        const parseRes = await patientInfo(patient_id);
        const parseData = parseRes.info.info;
        const parseWeight = parseRes.info.weight;
        const parsePlan = parseRes.plan; // treatment plan

        if (!cancelled) {
          setInfo({
            patient_name: parseData.user_name,
            patient_email: parseData.user_email,
            patient_gender: parseData.patient_gender,
            patient_age: parseData.patient_age,
            diagnostic_conclusion: parseData.diagnostic_conclusion
          });
          if (parseWeight) setWeight(parseWeight);

          let allTreatmentPlans = [];

          for (var i = 0; i < parsePlan.length; i++) {
            allTreatmentPlans.push({
              modified_time: new Date(parsePlan[i].modified_time),
              target_energy: parsePlan[i].target_feed_energy, 
              target_volume: parsePlan[i].target_feed_volume,
              description: parsePlan[i].description
            })
          }
          // if (parseData.length == 0) setTreatmentPlan([{modified_time: "", target_energy: "", target_volume: ""}])
          if (parsePlan.length != 0) setTreatmentPlan(allTreatmentPlans);
        }
      } catch(err) {
          console.error(err.message);
      }
    };
    getPatientInfo();
    return () => cancelled = true; 
  }, []);
  
  const onChange = e => setWeight(e.target.value);

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

      setChangeWeight(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  // edit the returning jsx
  return (
    <>
      {
      info == initialInfo? null :
      (
        <div className="mt-5">
          <h2 className="text-info mt-5">Patient Name: {info.patient_name}</h2>
          <h2>Email Address: {info.patient_email} </h2>
          <h2>Age: {info.patient_age}</h2>
          <h2>Gender: {info.patient_gender}</h2>
          <h4>Diagnostic Conclusion: {info.diagnostic_conclusion}</h4>
          {!isChangeWeight? 
          <div><h4>Weight: {weight}</h4> <button type="submit" className="btn btn-info" onClick={()=>setChangeWeight(true)}>Change Weight</button></div>
          : <div>
              <h4> Weight:</h4>
              <input type="text" name="weight" value={weight} placeholder="weight" onChange={e => onChange(e)} className="form-control my-3"/>
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
      ) 
      }
    </>
  )
}

export default PatientInfo;