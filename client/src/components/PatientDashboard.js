import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Linechart from "./LineChart";
import RainbowDatepicker from "./DatePicker";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

toast.configure();


const PatientDashboard = ({ match,  isClinician, patientID, logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePlan, setChangePlan] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState({target_energy: "", target_volume: ""})
  const [filter, setFilter] = useState("All Data")
  const [dates, setDates] = useState(null);
  const patient_id = patientID | match.params.id;
  const [dataType, setDataType] = useState("volume");

  const inputsInitial = {
    description: "",
    target_feed_volume: "",
    target_feed_energy: ""
  }

  const [inputs, setInputs] = useState(inputsInitial);

  const changeToggle = () => {
    setChangePlan(!changePlan);
  }

  const onChangeFilter = e => {
    setFilter(e.target.value);
  }

  const onChangeType = e => {
    setDataType(e.target.value);
  }

  const onChange = e =>
  setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      // pass in other data to fill in the patients table
      const body = { patient_id: patient_id, description: inputs.description, target_feed_volume: inputs.target_feed_volume, target_feed_energy: inputs.target_feed_energy };
      const response = await fetch(
        "http://localhost:5000/patientInfo/changeTreatmentPlan",
        {
          method: "POST",
          headers: {
            jwt_token: localStorage.token, 
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      
      const parseRes = await response.json(); // do something with the parseRes
      toast.success("Treatment Plan Change Successful!");
      setTreatmentPlan({
        target_energy: parseRes.target_feed_energy, 
        target_volume: parseRes.target_feed_volume
      });
      setInputs(inputsInitial); // reset the state
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
        const res = await fetch(`http://localhost:5000/dashboard/?id=${patient_id}`, {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          setName(parseData.user_name);
          setEmail(parseData.user_email);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, [patient_id]);


  // useEffect for getting the latest target treatment plan of the patient. Store that in the state
  useEffect(() => {
    let cancelled = false;

    const getTreatmentPlan = async () => {
      try {
        const res = await fetch(`http://localhost:5000/patientInfo/treatmentPlan?id=${patient_id}`, {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          const last = parseData.length - 1;
          setTreatmentPlan({
            target_energy: parseData[last].target_feed_energy, 
            target_volume: parseData[last].target_feed_volume
          });
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getTreatmentPlan();
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
          <select className="form-control" name="filter" value={filter} onChange={e => onChangeFilter(e)} style={{maxWidth: 150}}>
            <option value="All Data">All Data</option>
            <option value="By Day">By Day</option>
            <option value="By Month">By Month</option>
            <option value="By Year">By Year</option>
          </select>
        </div>
        
        <div style={{display: 'inline-block'}}>
          <select className="form-control" name="dataType" value={dataType} onChange={e => onChangeType(e)} style={{maxWidth: 250}}>
            <option value="volume">Volume Over Time</option>
            <option value="energy">Energy Intake Over Time</option>
          </select>
        </div>

      </div>
      {patient_id === 0? null:
      <Linechart 
        patient_id={patient_id} 
        type={dataType}
        target_energy={treatmentPlan.target_energy} 
        target_volume={treatmentPlan.target_volume} 
        filter={filter} 
        dates={formatDates(dates)}
      />}

      { isClinician ? (
        !changePlan? 
          <button onClick={changeToggle} className="btn btn-primary mt-5 mb-5">Change Treatment Plan</button> : 
          <form onSubmit={onSubmitForm}>
            <input
              type="text"
              name="description"
              value={inputs.description}
              placeholder="Treatment plan description"
              onChange={e => onChange(e)}
              className="form-control my-3"
            />

            <input
              type="text"
              name="target_feed_volume"
              value={inputs.target_feed_volume}
              placeholder="Target Feed Volume "
              onChange={e => onChange(e)}
              className="form-control my-3"
            />

          <input
              type="text"
              name="target_feed_energy"
              value={inputs.target_feed_energy}
              placeholder="Target Energy Intake (kcal/day)"
              onChange={e => onChange(e)}
              className="form-control my-3"
            />
          
          <button className="btn btn-success btn-block mt-5">Submit</button>
          <button onClick={changeToggle} className="btn btn-danger btn-block mb-5">Cancel</button>

          </form>
        ) : (
          <button onClick={logout} className="btn btn-primary mt-5"> Logout </button>
        )
      }
    </div>
  );
};

export default PatientDashboard;