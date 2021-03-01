import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const SearchBar = ({ patients, select, myPatients, setMyPatients }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const onChange = e => {
    setSearchTerm(e.target.value);
  }

  const containerStyles = {
    maxWidth: 400,
  };

  const handleClick = (patient) => {
    if (!inMyPatients(patient.user_id)) setMyPatients([...myPatients, patient]);
    else setMyPatients(myPatients.filter(p => p.user_id !== patient.user_id));
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

  return (
    <>
      <input
        type="text"
        placeholder="Search By Name"
        value={searchTerm}
        className="form-control my-3"
        style={containerStyles}
        onChange={onChange}      
      />
      <div>
        {searchTerm === ""?
          patients.map(patient => (
            <h3 key={patient.user_id} className="text-info">
            {typeof(select)==="undefined"? null : <input type="checkbox" defaultChecked={inMyPatients(patient.user_id)} onClick={() => handleClick(patient)} />}
            <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name}</Link>
            </h3>
          )):
          searchResults.map(patient => (
            <h3 key={patient.user_id} className="text-info">
              {typeof(select)==="undefined"? null : <input type="checkbox" defaultChecked={inMyPatients(patient.user_id)} onClick={() => handleClick(patient)} />}
              <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name}</Link>
            </h3>
          ))
        }
      </div>
    </>
  )
}

export default SearchBar;