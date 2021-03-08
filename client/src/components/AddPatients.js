import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { submitAddPatients } from "../api/fetches";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";

const AddPatients = () => {
  const allPatients = useSelector(state => state.allPatients);
  const myPatients = useSelector(state => state.patients);

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await submitAddPatients(myPatients);
      if (parseRes.result === "success") {
        toast.success("Patients are successfully added!");
      } else {
        toast.success(parseRes);
      }
    } catch (err) {
        console.error(err.message);
    }
  };

  return (
    <>
    <Link to="/dashboard">
      <button className="btn btn-primary mt-5">Back</button>
    </Link>
    <form className="mt-5" onSubmit={onSubmitForm}>
      <SearchBar select={true} />
        <button className="btn btn-success btn-block mt-5">Submit</button>
    </form>
    </>
  )
}

export default AddPatients;