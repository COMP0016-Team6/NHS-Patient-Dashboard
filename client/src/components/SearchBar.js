import React, {useState, useEffect} from "react";
import { useInput } from "../useInput";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { clinicianProfile, setClinicianPatients } from "../state/action";

const SearchBar = ({ select }) => {
  const dispatch = useDispatch();
  const [searchTerm, searchTermField] = useInput({placeholder:"Search By Name"});
  const [searchResults, setSearchResults] = useState([]);
  const myPatients = useSelector(state => state.patients);
  const allPatients = useSelector(state => state.allPatients);
  const patients = select? allPatients : myPatients;

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

  return (
    <>
      {searchTermField}
      <div>
        {searchTerm === ""?
          patients.map(patient => (
            <h3 key={patient.user_id}>
            {!select? null : <input type="checkbox" className="mr-2" defaultChecked={inMyPatients(patient.user_id)} onClick={() => handleClick(patient)} />}
            {!select? <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name}</Link> : patient.user_name}
            </h3>
          )):
          searchResults.map(patient => (
            <h3 key={patient.user_id}>
              {!select? null : <input type="checkbox" className="mr-2" defaultChecked={inMyPatients(patient.user_id)} onClick={() => handleClick(patient)} />}
              {!select? <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name}</Link> : patient.user_name}            
            </h3>
          ))
        }
      </div>
    </>
  )
}

export default SearchBar;