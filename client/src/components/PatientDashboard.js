import React, { useEffect, useState } from "react";
import Linechart from "./LineChart";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

toast.configure();


const PatientDashboard = ({ match }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePlan, setChangePlan] = useState(false);
  const inputsInitial = {
    description: "",
    target_feed_volume: "",
    target_feed_rate: ""
  }
  const [inputs, setInputs] = useState(inputsInitial);

  const { description, target_feed_volume, target_feed_rate } = inputs;


  const changeToggle = () => {
    setChangePlan(!changePlan);
  }

  const onChange = e =>
  setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      // pass in other data to fill in the patients table
      const body = { patient_id: match.params.id, description, target_feed_volume, target_feed_rate };
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
      setInputs(inputsInitial); // reset the state
      setChangePlan(false);
    } catch (err) {
      console.error(err.message);
      toast.error("Treatment Plan Change Failed!")
    }
  };



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

  return (
    <div>
      <h1 className="mt-5">{name}'s Dashboard</h1>
      
      {
      (target_feed_volume === "" || target_feed_volume === "")?  <Linechart patient_id = {match.params.id} /> : 
      <Linechart patient_id = {match.params.id} target_feed_rate = {target_feed_rate} target_feed_volume = {target_feed_volume} />
      }
      
      {!changePlan? 
        <button onClick={changeToggle} className="btn btn-primary mt-5 ">Change Treatment Plan</button> : 
        <form onSubmit={onSubmitForm}>
          <input
            type="text"
            name="description"
            value={description}
            placeholder="Treatment plan description"
            onChange={e => onChange(e)}
            className="form-control my-3"
          />

          <input
            type="text"
            name="target_feed_volume"
            value={target_feed_volume}
            placeholder="Target Feed Volume "
            onChange={e => onChange(e)}
            className="form-control my-3"
          />

        <input
            type="text"
            name="target_feed_rate"
            value={target_feed_rate}
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