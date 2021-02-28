import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";

const AddPatients = () => {
  const [patient_list, setPatientList] = useState([]);
  const [patients, setPatients] = useState([]);

  const onChange = e =>
    setPatientList(e.target.value);

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:5000/myPatients/add",
        {
          method: "POST",
          headers: { 
            jwt_token: localStorage.token, 
            "Content-type": "application/json"
          },
          body: JSON.stringify({patient_list})
        }
      );
      const parseData = await res.json();
      if (parseData.result === "success") {
        toast.success("Patients are successfully added!");
      } else {
        toast.success(parseData);
      }
    } catch (err) {
        console.error(err.message);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const getAllPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/myPatients/getAll", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          setPatients(parseData);
        }
        
      } catch (err) {
        console.error(err.message);
      }
    };
    getAllPatients();
    return () => cancelled = true; 
  }, []);

  return (
    <>
    <Link to="/dashboard">
      <button className="btn btn-primary mt-5">Back</button>
    </Link>
      <form className="mt-5" onSubmit={onSubmitForm}>
      <SearchBar patients={patients} select={true} setSelectedPatients={setPatientList} />

        {/*<input
          type="text"
          name="patient_list"
          value={patient_list}
          placeholder="patients emails (delimered by space)"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />*/}

        <button className="btn btn-success btn-block">Submit</button>
      </form>
    </>
  )
}

export default AddPatients;