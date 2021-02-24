import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const Register = ({ setAuth, setIsClinician }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    role: "Patient",
    age: "",
    gender: "Male",
    diagnosticConclusion: ""
  });
  // for now, no read/write. can do both by default.
  const { email, password, name, role, age, gender, diagnosticConclusion } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      // pass in other data to fill in the patients table
      const body = { email, password, name, role, age, gender, diagnosticConclusion };
      const res = await fetch(
        "http://localhost:5000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      
      const parseRes = await res.json();

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
        
        {inputs.role==="Clinician"? null : (
            // HANDLE THESE! Store those in the patients table, make sure the onchange works and Later verify the values of inputs
            // make the diagnostic conclusion input a text box
            <Fragment>
              <input
                type="text"
                name="age"
                value={age}
                placeholder="age"
                onChange={e => onChange(e)}
                className="form-control my-3"
              />
      
              <select name="gender" value={gender} onChange={e => onChange(e)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
      
              {/** Make this an extendable text box */}
              <input
                type="text"
                name="diagnosticConclusion"
                value={diagnosticConclusion}
                placeholder="diagnosticConclusion"
                onChange={e => onChange(e)}
                className="form-control my-3"
              />
            </Fragment>
            )
        }   

        <button className="btn btn-success btn-block mt-5">Submit</button>
      </form>
      <Link to="/login">login</Link>
    </Fragment>
  );
};

export default Register;