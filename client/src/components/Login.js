import React from "react";
import { Link } from "react-router-dom";
import { useInput } from "../useInput";
import { loginUser } from "../api/fetches";

import { toast } from "react-toastify";

const Login = ({ setAuth, setIsClinician }) => {

  const [email, emailField] = useInput({placeholder: "email"});
  const [password, passwordField] = useInput({type:"password", placeholder:"password"});

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await loginUser({email, password});

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Logged in Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
      setIsClinician(parseRes.user.user_role === "Clinician");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1 className="mt-5 text-center">Login</h1>
      <form onSubmit={onSubmitForm}>
        {emailField}
        {passwordField}
        <button type="submit" className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register">register</Link>
    </>
  );
};

export default Login;
