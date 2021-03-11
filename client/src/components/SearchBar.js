import React, {useState, useEffect} from "react";
import { useInput } from "../useInput";
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';

import { useSelector, useDispatch } from "react-redux";
import { clinicianProfile, setClinicianPatients } from "../state/action";

const SearchBar = ({ select }) => {
  const dispatch = useDispatch();
  const [searchTerm, searchTermField] = useInput({placeholder:"Search By Name"});
  const [searchResults, setSearchResults] = useState([]);
  const myPatients = useSelector(state => state.patients);
  const allPatients = useSelector(state => state.allPatients);
  const patients = select? allPatients : myPatients;

  const containerStyles = {
    maxWidth: 400,
  };

  const handleClick = (patient) => {
    if (!inMyPatients(patient.user_id)) dispatch(setClinicianPatients([...myPatients, patient]));
    else dispatch(setClinicianPatients(myPatients.filter(p => p.user_id !== patient.user_id)));
    console.log(myPatients)
  }

  useEffect(() => {
    const results = patients.filter(patient => patient.user_name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  }, [searchTerm]);

  const inMyPatients = (patient_userID) => {
    for (var i = 0; i < myPatients.length; i++) {
      if (myPatients[i].user_id == patient_userID) return true;
    }
    return false;
  }

  if (patients === undefined) return null;

  console.log(patients); 

  return (
    <>
      {searchTermField}
      <div>
        {searchTerm === ""?
          patients.map(patient => (
            <h3 key={patient.user_id}>
            {!select? null : <Checkbox color="primary" defaultChecked={inMyPatients(patient.user_id)} onClick={() => handleClick(patient)} 
            inputProps={{ 'aria-label': 'secondary checkbox' }}/>}
            {!select? <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name} ({patient.user_email})</Link> : patient.user_name+" ("+patient.user_email+")"}
            </h3>
          )):
          searchResults.map(patient => (
            <h3 key={patient.user_id}>
              {!select? null : <Checkbox color="primary" defaultChecked={inMyPatients(patient.user_id)} onClick={() => handleClick(patient)} 
              inputProps={{ 'aria-label': 'secondary checkbox' }}/>}
              {!select? <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name} ({patient.user_email})</Link> : patient.user_name+" ("+patient.user_email+")"}            
            </h3>
          ))
        }
      </div>
    </>
  )
}

export default SearchBar;