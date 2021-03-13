import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { submitTreatmentPlan, patientAllInfo } from "../api/fetches";
import { useInput } from "../useInput";
import Linechart from "./LineChart";
import RainbowDatepicker from "./DatePicker";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { patientProfile } from "../state/action";
import NavBar from "./Navbar";
import { useStylesUser } from "../styles/styles";

toast.configure();

const PatientDashboard = ({ match, logout }) => {
  const classes = useStylesUser();
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user_id);
  const patientInfo = useSelector(state => state.patientInfo);
  const patientFeed = useSelector(state => state.patientFeed);
  const patientPlan = useSelector(state => state.patientPlan);

  const isClinician = useSelector(state => state.isClinician);
  const patient_id = !isClinician? user_id : patientInfo.user_id | match.params.id;

  const [changePlan, setChangePlan] = useState(false);
  const [filter, setFilter] = useState("All Data")
  const [dates, setDates] = useState(null);
  const [dataType, setDataType] = useState("volume");
  const [showWeight, setShowWeight] = useState(false);
  const [description, descriptionField] = useInput({placeholder: "Treatment plan description"});
  const [target_feed_volume, targetVolField] = useInput({placeholder: "Target Feed Volume"});
  const [target_feed_energy, targetEnergyField] = useInput({placeholder: "Target Energy Intake (kcal/day)"});

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await submitTreatmentPlan({description, target_feed_volume, target_feed_energy}, patient_id); // do something with the parseRes
      if (parseRes === "Success") {
        toast.success("Treatment Plan Change Successful!");
        setChangePlan(false);
      } else {
        toast.error(parseRes);
      }
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
        const parseRes = await patientAllInfo(patient_id);
        if (!cancelled)
          dispatch(patientProfile(parseRes));
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, [patient_id]);

  if (patientInfo === undefined || patientFeed === undefined || patientPlan.length === 0) return null;

  return (
    <div className={classes.root}>
      <NavBar heading="" logout={logout} />

      <div>
        <div style={{width: "75%", justify: "center", alignItems: "center", margin: "auto"}}>
          {isClinician? 
          <div>
            <Link to="/dashboard">
              <button className="btn btn-primary mt-5">Back</button> 
            </Link>
            <h1 className="mt-3 mb-5" align="center"><Link to={`/patientInfo/${patient_id}`}>{patientInfo.user_name}</Link>'s Dashboard</h1>
          </div> : <h1 className="mt-3 mb-5" align="center">My Dashboard</h1>}

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

          {patient_id === 0? null :
          <Linechart 
            patient_id={patient_id} 
            type={dataType}
            filter={filter}
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
      </div>
    </div>
  );
};

export default PatientDashboard;