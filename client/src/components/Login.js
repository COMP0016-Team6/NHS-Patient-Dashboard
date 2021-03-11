import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { loggedIn, loggedOut } from "../state/action";
import { Link } from "react-router-dom";
import { loginUser } from "../api/fetches";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import { toast } from "react-toastify";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/COMP0016-Team6/NHS-Patient-Dashboard">
        COMP0016 Team 6
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  image: {
    backgroundImage: 'url(https://www.gosh.nhs.uk/static/images/logo.e57c277b2a23.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#ffffff',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginTop: '25vh',
    backgroundColor: "#1976d2",
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ColorButton = withStyles(() => ({
  root: {
    backgroundColor: blue[700],
    '&:hover': {
      backgroundColor: blue[900],
    },
  },
}))(Button);

const Login = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

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

  const classes = useStyles();

  return (
    <Grid container component="main" direction="row" className={classes.root} spacing={2}>
      <CssBaseline />
      <Grid item xs={0} sm={2} md={2} />
      <Grid item xs={12} sm={8} md={4} component={Paper} >
        <div className={classes.paper}>
          <Avatar className={classes.avatar}></Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} onSubmit={onSubmitForm} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => onChange(e)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => onChange(e)}
            />
            <ColorButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </ColorButton>
            <Grid container>
              <Grid item xs>
                <Link to="/register" variant="body2">Register</Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      <Grid item xs={0} sm={2} md={1} />
      <Grid item xs={false} sm={4} md={4} className={classes.image} />
    </Grid>
  );
};

export default Login;
