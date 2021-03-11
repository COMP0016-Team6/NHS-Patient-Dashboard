import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { changedWeight } from "../state/action";
import TreatmentHistory from "./TreatmentHistory";
import { Link } from "react-router-dom";
import { changeWeight } from "../api/fetches";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { blue } from '@material-ui/core/colors';

const ColorButton = withStyles(() => ({
  root: {
    backgroundColor: blue[700],
    '&:hover': {
      backgroundColor: blue[900],
    },
  },
}))(Button);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

toast.configure();

const PatientInfo = ({ logout }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const treatmentPlan = useSelector(state => state.patientPlan);
  const isClinician = useSelector(state => state.isClinician);
  const patientInfo = useSelector(state => state.patientInfo);
  const { user_id, user_name, user_email, patient_gender, patient_dob, diagnostic_conclusion, weight } = patientInfo;

  const [isChangeWeight, setChangeWeight] = useState(false);
  const [newWeight, setWeight] = useState(weight);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changePatientWeight = async () => {
    try {
      const parseRes = await changeWeight({ user_id, newWeight });
      console.log(parseRes);
      setChangeWeight(false);
      if (parseRes === "Success") {
        dispatch(changedWeight(newWeight));
        toast.success("Weight Change Successful!");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }

    handleClose();
  }
  
  function calcAge(dateString) {
    let YEARLEN = 31557600000;
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (YEARLEN));
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar> 
          <Typography variant="h6" className={classes.title}>
            {user_name}'s Information
          </Typography>
          <Button onClick= {logout} color="inherit"><ExitToAppOutlinedIcon className="mr-1"/>Logout</Button>          
        </Toolbar>
      </AppBar>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item md={8}>
          {isClinician? (<Link to={`/dashboard/${user_id}`}> <ColorButton type="submit" variant="contained" color="primary" className={classes.submit, "mb-5 mt-5"}><ArrowLeftIcon/> Back</ColorButton></Link>)
        : (<Link to={`/dashboard`}> <ColorButton type="submit" variant="contained" color="primary" className={classes.submit, "mb-5 mt-5"}><ArrowLeftIcon/> Back</ColorButton></Link>)}
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item md={5}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              centered
            >
              <Tab label="Patient Basic Information" {...a11yProps(0)} />
              <Tab label="Treatment History" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <List>
              <ListItem>
                <h3>Patient Name: {user_name}</h3>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <h3>Email Address: {user_email}</h3>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <h3>Date of Birth: {new Date(patient_dob).toLocaleDateString()} ({calcAge(patient_dob)} years)</h3>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <h3>Gender: {patient_gender}</h3>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <h3>Dignostic Conclusion: {diagnostic_conclusion}</h3>
              </ListItem>
              <Divider component="li" />
              <ListItem>
              <div style={{display: "inline-block"}}><h4>Weight: {weight}</h4></div> <div style={{display: "inline-block", marginLeft: 10}}>
                  <Button variant="outlined" color="primary" onClick={()=>setChangeWeight(true), handleClickOpen}>
                    <EditOutlinedIcon className="mr-1"/>Change Weight
                  </Button>
                  <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change Weight</DialogTitle>
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Weight"
                        fullWidth
                        value={newWeight}
                        onChange={e => setWeight(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button type="submit" onClick={()=>{setWeight(weight)}, handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button type="submit" onClick={changePatientWeight} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </ListItem>
              <Divider component="li" />
            </List>                    
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="mt-5 text-center">
              <div style={{maxWidth: 800, maxHeight: 600, marginBottom: 50}}>
              {treatmentPlan.length === 0? null : 
              <TreatmentHistory treatmentPlan={treatmentPlan} />
              }
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            
          </TabPanel>
          
        </Grid>
      </Grid>
    </div>
  )
}

export default PatientInfo;