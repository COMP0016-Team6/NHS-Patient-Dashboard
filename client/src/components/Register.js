import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const Register = ({ setAuth, setIsClinician }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    role: "Patient",
    patient_list: ""
  });
  // for now, no read/write. can do both by default.
  const { email, password, name, role, patient_list } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password, name, role, patient_list };
      const response = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      
      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Register Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }

      parseRes.user.user_role === "Clinician"? setIsClinician(true) : setIsClinician(false);

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Register</h1>
      <form onSubmit={onSubmitForm}>
        
        <input
          type="text"
          name="email"
          value={email}
          placeholder="email"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        
        <input
          type="text"
          name="name"
          value={name}
          placeholder="name"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        
        <select name="role" value={role} onChange={e => onChange(e)}>
          <option value="Patient">Patient</option>
          <option value="Clinician">Clinician</option>
        </select>

        <input
          type="text"
          name="patient_list"
          value={patient_list}
          placeholder="patients emails (delimered by space)"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
      

        <button className="btn btn-success btn-block mt-5">Submit</button>
      </form>
      <Link to="/login">login</Link>
    </Fragment>
  );
};

export default Register;