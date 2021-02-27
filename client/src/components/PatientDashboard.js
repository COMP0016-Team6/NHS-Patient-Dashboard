import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Linechart from "./LineChart";
import RainbowDatepicker from "./DatePicker";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

toast.configure();


const PatientDashboard = ({ match }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePlan, setChangePlan] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState({target_rate: "", target_volume: ""})
  const [filter, setFilter] = useState("All Data")
  const [dates, setDates] = useState(null);
  
  const inputsInitial = {
    description: "",
    target_feed_volume: "",
    target_feed_rate: ""
  }

  const [inputs, setInputs] = useState(inputsInitial);

  const changeToggle = () => {
    setChangePlan(!changePlan);
  }

  const onChangeFilter = (e) => {
    setFilter(e.target.value);
  }

  const onChange = e =>
  setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      // pass in other data to fill in the patients table
      const body = { patient_id: match.params.id, description: inputs.description, target_feed_volume: inputs.target_feed_volume, target_feed_rate: inputs.target_feed_rate };
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
        target_rate: parseRes.target_feed_rate, 
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
        const res = await fetch(`http://localhost:5000/dashboard/?id=${match.params.id}`, {
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
  }, []);


  // useEffect for getting the latest target treatment plan of the patient. Store that in the state
  useEffect(() => {
    let cancelled = false;

    const getTreatmentPlan = async () => {
      try {
        const res = await fetch(`http://localhost:5000/patientInfo/treatmentPlan?id=${match.params.id}`, {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          const last = parseData.length - 1;
          setTreatmentPlan({
            target_rate: parseData[last].target_feed_rate, 
            target_volume: parseData[last].target_feed_volume
          });
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getTreatmentPlan();
    return () => cancelled = true; 
  }, []);

  return (
    <div>
      <Link to="/dashboard">
        <button className="btn btn-primary mt-5">Back</button>
      </Link>
      <h1 className="mt-5"><Link to={`/patientInfo/${match.params.id}`}>{name}</Link>'s Dashboard</h1>
      
      <RainbowDatepicker dates={formatDates(dates)} setDates={setDates} />

      <select name="filter" value={filter} onChange={e => onChangeFilter(e)}>
        <option value="All Data">All Data</option>
        <option value="By Day">By Day</option>
        <option value="By Month">By Month</option>
        <option value="By Year">By Year</option>
      </select>
      
      <Linechart 
        patient_id={match.params.id} 
        target_rate={treatmentPlan.target_rate} 
        target_volume={treatmentPlan.target_volume} 
        filter={filter} 
        dates={formatDates(dates)}
      /> 

  
      
      
      
      {!changePlan? 
        <button onClick={changeToggle} className="btn btn-primary mt-5 ">Change Treatment Plan</button> : 
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
            name="target_feed_rate"
            value={inputs.target_feed_rate}
            placeholder="Target Feed Rate "
            onChange={e => onChange(e)}
            className="form-control my-3"
          />
        
        <button className="btn btn-success btn-block mt-5">Submit</button>
        <button onClick={changeToggle} className="btn btn-danger btn-block mb-5">Cancel</button>

        </form>        
      }
    </div>
  );
};

export default PatientDashboard;