import React from "react";
import { useDispatch } from "react-redux";
import { loggedIn, loggedOut } from "../state/action";
import { useInput } from "../useInput";
import { loginUser } from "../api/fetches";

import { toast } from "react-toastify";
import { Grid, Avatar } from '@material-ui/core';
import { useStylesLogin } from "../styles/styles";

const Login = () => {
  const classes = useStylesLogin();
  const dispatch = useDispatch();
  const [email, emailField] = useInput({ placeholder: "email *", properties: {name: "email"} });
  const [password, passwordField] = useInput({ type: "password", placeholder: "password *" });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await loginUser({ email, password });
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
    <Grid container component="main" direction="row" justify="center">
      <Grid item sm={4} md={1} />
      <Grid item xs={12} sm={8} md={5} style={{ margin: 30 }}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar} />
          <h1 className="text-center">Login</h1>
          <form className={classes.form} onSubmit={onSubmitForm}>
            {emailField}
            {passwordField}
            <button type="submit" className="btn btn-success btn-block mt-5">Submit</button>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={4} className={classes.image} style={{ marginLeft: 30 }} />
    </Grid>
  );
};

export default Login;
