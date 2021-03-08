import React from "react";
import { useDispatch } from "react-redux";
import { loggedIn, loggedOut } from "../state/action";
import { Link } from "react-router-dom";
import { useInput } from "../useInput";
import { loginUser } from "../api/fetches";

import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const [email, emailField] = useInput({placeholder: "email"});
  const [password, passwordField] = useInput({type:"password", placeholder:"password"});

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await loginUser({email, password});
      const user = parseRes.user;
      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        dispatch(loggedIn(user.user_role, user.user_id, user.user_name, user.user_email));
        toast.success("Logged in Successfully");
      } else {
        dispatch(loggedOut());
        toast.error(parseRes);
      }
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
