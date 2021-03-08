import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { submitAddPatients } from "../api/fetches";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";

const AddPatients = ({ myPatients, setMyPatients }) => {
  const [allPatients, setAllPatients] = useState([]);

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

  useEffect(() => {
    let cancelled = false;
    const getAllPatients = async () => {
      try {
        const parseRes =  await allPatients();
        if (!cancelled) {
          setAllPatients(parseRes);
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
      <SearchBar select={true} />
        <button className="btn btn-success btn-block mt-5">Submit</button>
      </form>
    </>
  )
}

export default AddPatients;