import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const PatientInfo = ({ match }) => {
  const initialInfo = {
    patient_name: "",
    patient_email: "",
    patient_gender: "",
    patient_age: "", // change to DOB
    diagnostic_conclusion: ""
  };

  const [info, setInfo] = useState(initialInfo);

  useEffect (() => {
    let cancelled = false;
    const getPatientInfo = async() => {
      try {
        const res = await fetch(`http://localhost:5000/patientInfo/?id=${match.params.id}`, {
            method: "POST",
            headers: { jwt_token: localStorage.token,
              "Content-type": "application/json"
            }
        });
        const parseData = await res.json();
        
        if (!cancelled) {
          setInfo({
            patient_name: parseData.user_name,
            patient_email: parseData.user_email,
            patient_gender: parseData.patient_gender,
            patient_age: parseData.patient_age,
            diagnostic_conclusion: parseData.diagnostic_conclusion
          });
        }
        console.log(parseData);
      } catch(err) {
          console.error(err.message);
      }
    };
    getPatientInfo();
    return () => cancelled = true; 
  }, []);
  
  // edit the returning jsx
  return (
    <>
      {
      info == initialInfo? null :
      (
        <div>
          <h1>{info.patient_name} ({info.patient_email})</h1>
          <h2>Age: {info.patient_age}. Gender: {info.patient_gender}</h2>
          <h4>Diagnostic Conclusion: {info.diagnostic_conclusion}</h4>
        </div>
      ) 
      }
    </>
  )
}

export default PatientInfo;