import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { submitTreatmentPlan, patientAllInfo } from "../api/fetches";
import Linechart from "./LineChart";
import RainbowDatepicker from "./DatePicker";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { patientProfile } from "../state/action";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import EditIcon from '@material-ui/icons/Edit';
import { blue } from '@material-ui/core/colors';

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
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
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

toast.configure();

const PatientDashboard = ({ match, logout }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user_id = useSelector(state => state.user_id);
  const patientInfo = useSelector(state => state.patientInfo);
  const patientFeed = useSelector(state => state.patientFeed);
  const patientPlan = useSelector(state => state.patientPlan);

  const isClinician = useSelector(state => state.isClinician);
  const patient_id = !isClinician? user_id : patientInfo.user_id | match.params.id;

  const [filter, setFilter] = useState("All Data")
  const [dates, setDates] = useState(null);
  const [dataType, setDataType] = useState("volume");
  const [showWeight, setShowWeight] = useState(false);
  const [inputs, setInputs] = useState({
    description: "",
    target_feed_volume: "",
    target_feed_energy: ""
  });

  const { description, target_feed_volume, target_feed_energy } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const parseRes = await submitTreatmentPlan({description, target_feed_volume, target_feed_energy}, patient_id); // do something with the parseRes
      if (parseRes === "Success") {
        toast.success("Treatment Plan Change Successful!");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Treatment Plan Change Failed!")
    }

    handleClose();
  };

  const formatDates = (dates) => {
    if (dates != null && dates[0] != null && dates[1] != null) {
      for (var i = 0; i < dates.length; i++) {
        let newDate = dates[i].toLocaleDateString().split("/");
        dates[i] = new Date(parseInt(newDate[2]), parseInt(newDate[1])-1, parseInt(newDate[0]));
      }
    }
    return dates;
  }

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const parseRes = await patientAllInfo(patient_id);
        if (!cancelled)
          dispatch(patientProfile(parseRes));
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, [patient_id]);


  if (patientInfo === undefined || patientFeed === undefined || patientPlan.length === 0) return null;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {patientInfo.user_name}'s Dashboard
          </Typography>          
          <Button onClick= {logout} color="inherit"><ExitToAppOutlinedIcon className="mr-1"/>Logout</Button>
        </Toolbar>
      </AppBar>

      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item md={9}>
          {isClinician? (
            <Link to="/dashboard"> 
              <ColorButton type="submit" variant="contained" color="primary" className={classes.submit, "mt-5 mb-5"}><ArrowLeftIcon/> Back</ColorButton>
            </Link>
          ) : null}
        </Grid>
      </Grid>

      {isClinician? (
        <h1 className="text-center"><Link to={`/patientInfo/${patient_id}`}>{patientInfo.user_name}</Link>'s Dashboard</h1>
      ) : <h1 className="text-center mt-5"><Link to={`/patientInfo/${patient_id}`}>{patientInfo.user_name}</Link>'s Dashboard</h1>}
      <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <Grid item md={9}>

          <div className="mb-3" style={{display: 'flex'}}>
            <RainbowDatepicker dates={formatDates(dates)} setDates={setDates} />
          </div>
          <FormControl variant="outlined" className={classes.formControl} className="mr-3">
            <InputLabel id="demo-simple-select-outlined-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={filter}
              onChange={e => setFilter(e.target.value)} 
              style={{maxWidth: 150}}
              label="Filter"
            >
              <MenuItem value="All Data">All Data</MenuItem>
              <MenuItem value="By Day">By Day</MenuItem>
              <MenuItem value="By Month">By Month</MenuItem>
              <MenuItem value="By Year">By Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl} className="mr-3">
            <InputLabel id="demo-simple-select-outlined-label">Data Type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={dataType}
              onChange={e => setDataType(e.target.value)} 
              style={{maxWidth: 250}}
              label="Data Type"
            >
              <MenuItem value="volume">Volume Over Time</MenuItem>
              <MenuItem value="energy">Energy Intake Over Time</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                defaultChecked={showWeight}
                onClick={() => setShowWeight(!showWeight)}
                name="checkedB"
                color="primary"
              />
            }
            label="Show Weight"
          /> 
          
          { isClinician ? (
            <React.Fragment>
              <ColorButton onClick={handleClickOpen} variant="contained" color="primary" className={classes.submit}>
                <EditIcon className="mr-1"/>Change Treatment Plan
              </ColorButton>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth="true" maxWidth="lg">
                <form onSubmit={onSubmitForm}>
                <DialogTitle id="form-dialog-title">Change Treatment Plan</DialogTitle>
                  <Grid container direction="row" justify="center">
                    <Grid item md={10}>
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
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justify="center">
                    <Grid item md={10}>
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
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justify="center">
                    <Grid item md={10}>
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
                    </Grid>
                  </Grid>                
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </DialogActions>
                </form>
              </Dialog>
            </React.Fragment>
            ) : null
          }   
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item md={10}>
          {patient_id === 0? null :
          <Linechart 
            patient_id={patient_id} 
            type={dataType}
            filter={filter}
            dates={formatDates(dates)}
            showWeight={showWeight}
          />}
        </Grid>
      </Grid>
    </div>
  );
};

export default PatientDashboard;