import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";

// I need both the list of all patients and the patients I am currently supervising
// as well as a method for updating my list of supervised patients

const AddPatients = ({ myPatients, setMyPatients }) => {
  const [allPatients, setAllPatients] = useState([]); // all patients

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
          body: JSON.stringify(myPatients)
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
          setAllPatients(parseData);
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
      <SearchBar patients={allPatients} select={true} myPatients={myPatients} setMyPatients={setMyPatients} />
        <button className="btn btn-success btn-block mt-5">Submit</button>
      </form>
    </>
  )
}

export default AddPatients;