import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { submitTreatmentPlan, patientProfile } from "../api/fetches";
import { useInput } from "../useInput";
import Linechart from "./LineChart";
import RainbowDatepicker from "./DatePicker";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

toast.configure();

const PatientDashboard = ({ match,  isClinician, patientID, logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePlan, setChangePlan] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState([])
  const [filter, setFilter] = useState("All Data")
  const [dates, setDates] = useState(null);
  const patient_id = patientID | match.params.id;
  const [dataType, setDataType] = useState("volume");
  const [showWeight, setShowWeight] = useState(false);
  const [description, descriptionField] = useInput({placeholder: "Treatment plan description"});
  const [target_feed_volume, targetVolField] = useInput({placeholder: "Target Feed Volume"});
  const [target_feed_energy, targetEnergyField] = useInput({placeholder: "Target Energy Intake (kcal/day)"});

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      // pass in other data to fill in the patients table
      const parseRes = await submitTreatmentPlan({description, target_feed_volume, target_feed_energy}, patient_id) // do something with the parseRes

      toast.success("Treatment Plan Change Successful!");
      // setTreatmentPlan([...treatmentPlan, {
      //   modified_time: new Date(parseRes.modified_time),
      //   target_energy: parseRes.target_feed_energy, 
      //   target_volume: parseRes.target_feed_volume
      // }]);
      // setInputs(inputsInitial); // reset the state
      setChangePlan(false);
    } catch (err) {
      console.error(err.message);
      toast.error("Treatment Plan Change Failed!")
    }
  };

  const formatDates = (dates) => {
    if (dates != null && dates[0] != null && dates[1] != null) {
      for (var i = 0; i < dates.length; i++) {
        let newDate = dates[i].toLocaleDateString().split("/");
        dates[i] = new Date(parseInt(newDate[2]), parseInt(newDate[1])-1, parseInt(newDate[0]));
      }
    }
    return dates;
  }

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const parseRes = await patientProfile(patient_id);
        const {info, plan} = parseRes;

        if (!cancelled) {
          setName(info.user_name);
          setEmail(info.user_email);
          
          // for getting the latest target treatment plan of the patient. Store that in the state
          let allTreatmentPlans = [];
          
          // Make this cleaner and better
          for (var i = 0; i < plan.length; i++) {
            allTreatmentPlans.push({
              modified_time: new Date(plan[i].modified_time),
              target_energy: plan[i].target_feed_energy, 
              target_volume: plan[i].target_feed_volume,
              description: plan[i].description
            })
          }
          if (plan.length == 0) setTreatmentPlan([{modified_time: "", target_energy: "", target_volume: ""}])
          else setTreatmentPlan(allTreatmentPlans);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, [patient_id]);


  return (
    <div>
      {isClinician? (<Link to="/dashboard"> <button className="btn btn-primary mt-5">Back</button> </Link>) : null}

      <h1 className="mt-5 mb-5"><Link to={`/patientInfo/${patient_id}`}>{name}</Link>'s Dashboard</h1>
      <div>
        <div className="mb-3" style={{display: 'flex'}}>
          <RainbowDatepicker dates={formatDates(dates)} setDates={setDates} />
        </div>

        <div className="mr-3" style={{display: 'inline-block'}}>
          <select className="form-control" name="filter" value={filter} onChange={e => setFilter(e.target.value)} style={{maxWidth: 150}}>
            <option value="All Data">All Data</option>
            <option value="By Day">By Day</option>
            <option value="By Month">By Month</option>
            <option value="By Year">By Year</option>
          </select>
        </div>
        
        <div className="mr-3" style={{display: 'inline-block'}}>
          <select className="form-control" name="dataType" value={dataType} onChange={e => setDataType(e.target.value)} style={{maxWidth: 250}}>
            <option value="volume">Volume Over Time</option>
            <option value="energy">Energy Intake Over Time</option>
          </select>
        </div>
        
        <div style={{display: 'inline-block'}}>
          <input type="checkbox" defaultChecked={showWeight} onClick={() => setShowWeight(!showWeight)} />
          Show Weight
        </div>
      </div>
      {patient_id === 0 || treatmentPlan.length === 0 ? null:
      <Linechart 
        patient_id={patient_id} 
        type={dataType}
        target_energy={treatmentPlan.target_energy} 
        target_volume={treatmentPlan.target_volume} 
        filter={filter} 
        treatmentPlan={treatmentPlan}
        dates={formatDates(dates)}
        showWeight={showWeight}
      />}

      { isClinician ? (
        !changePlan? 
        <button onClick={() => setChangePlan(!changePlan)} className="btn btn-primary mt-5 mb-5">Change Treatment Plan</button> : 
          <form onSubmit={onSubmitForm}>
            {descriptionField}
            {targetVolField}
            {targetEnergyField}
            <button type="submit" className="btn btn-success btn-block mt-5">Submit</button>
            <button onClick={() => setChangePlan(!changePlan)} className="btn btn-danger btn-block mb-5">Cancel</button>
          </form>
        ) : ( <button onClick={logout} className="btn btn-primary mt-5"> Logout </button> )
      }
    </div>
  );
};

export default PatientDashboard;