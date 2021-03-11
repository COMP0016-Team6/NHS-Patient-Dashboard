import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/fetches";
import { loggedIn, loggedOut } from "../state/action";
import RainbowDatepicker from "./DatePicker";

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
    backgroundColor: "#1976d2",
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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

const Register = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    weight: "",
    diagnosticConclusion: "",
    description: "",
    target_feed_volume: "",
    target_feed_energy: ""
  });

  const { email, password, name, weight, diagnosticConclusion, description, target_feed_volume, target_feed_energy } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const [dob, setDOB] = useState(null);
  const [role, setRole] = useState("Patient");
  const [gender, setGender] = useState("Male");
  
  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await registerUser({email, password, name, role, dob, gender, diagnosticConclusion, weight}, { description, target_feed_volume, target_feed_energy, modified_time: new Date()});
      if (parseRes.jwtToken) {
        const user = parseRes.user;
        localStorage.setItem("token", parseRes.jwtToken);
        dispatch(loggedIn(user.user_role, user.user_id, user.user_name, user.user_email));
        toast.success("Registered Successfully");
      } else {
        dispatch(loggedOut());
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const formatDate = (date) => {
    if (date != null) {
        let newDate = date.toLocaleDateString().split("/");
        date = new Date(parseInt(newDate[2]), parseInt(newDate[1])-1, parseInt(newDate[0]));
    }
    return date;
  }

  return (
    <Grid container component="main" direction="row" justify="center" className={classes.root}>
      <CssBaseline />
      <Grid item xs={0} sm={2} md={1} />
      <Grid item xs={12} sm={8} md={5} component={Paper}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}></Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} onSubmit={onSubmitForm} noValidate>
            <h5>Basic Information:</h5>
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={e => onChange(e)}
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={role}
                onChange={e => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="Patient">Patient</MenuItem>
                <MenuItem value="Clinician">Clinician</MenuItem>
              </Select>
            </FormControl>
            {role==="Clinician"? null : (
              // HANDLE THESE! Store those in the patients table, make sure the onchange works and Later verify the values of inputs
              // make the diagnostic conclusion input a text box
              <>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item md={3}>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        label="Role"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md>
                    <RainbowDatepicker dates={formatDate(dob)} setDates={setDOB} single={true} />
                  </Grid>
                </Grid>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="weight"
                  label="Weight"
                  name="weight"
                  autoComplete="weight"
                  autoFocus
                  value={weight}
                  onChange={e => onChange(e)}
                />
                
                {/** Make this an extendable text box */}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="diagnosticConclusion"
                  label="Diagnostic Conclusion"
                  name="diagnosticConclusion"
                  autoComplete="diagnosticConclusion"
                  autoFocus
                  value={diagnosticConclusion}
                  onChange={e => onChange(e)}
                />
                <h5>Treatment Plan:</h5>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                  autoFocus
                  value={description}
                  onChange={e => onChange(e)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="target_feed_volume"
                  label="Target Feed Volume"
                  name="target_feed_volume"
                  autoComplete="target_feed_volume"
                  autoFocus
                  value={target_feed_volume}
                  onChange={e => onChange(e)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="target_feed_energy"
                  label="Target Feed Energy"
                  name="target_feed_energy"
                  autoComplete="target_feed_energy"
                  autoFocus
                  value={target_feed_energy}
                  onChange={e => onChange(e)}
                />
              </>
              )
            }   
            <ColorButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </ColorButton>
            <Grid container>
              <Grid item xs>
                <Link to="/login" variant="body2">Login</Link>
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

export default Register;