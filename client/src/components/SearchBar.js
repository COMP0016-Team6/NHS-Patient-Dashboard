import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

// each patient contains user_id, user_name, user_email
const SearchBar = ({ patients, select, setSelectedPatients }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const onChange = e => {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    const results = patients.filter(patient => patient.user_name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <>
      <input
        type="text"
        placeholder="Search By Name"
        value={searchTerm}
        onChange={onChange}      
      />
      <div>
        {searchTerm === ""?
          patients.map(patient => (
            <h3 key={patient.user_id} className="text-info">
            {typeof(select)==="undefined"? null : <input type="checkbox"/>}
            <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name}</Link>
            </h3>
          )):
          searchResults.map(patient => (
            <h3 key={patient.user_id} className="text-info">
              {typeof(select)==="undefined"? null : <input type="checkbox"/>}
              <Link to={`/dashboard/${patient.user_id}`}>{patient.user_name}</Link>
            </h3>
          ))
        }
      </div>
    </>
  )
}

export default SearchBar;