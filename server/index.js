const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(express.json())
app.use(cors())

// ROUTES

// register and login route
app.use("/auth", require("./routes/jwtAuth"));

// getFeeds for a patient
app.use("/getFeeds", require("./routes/getFeeds"));

// information about the patient
app.use("/patientInfo", require("./routes/patientInfo"));

// add patients in your dashboard (as a clinician)
// get a list of supervised patients (as a clinician)
app.use("/myPatients", require("./routes/myPatients")); 

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

app.use(function(err, req, res, next) {
  console.error(err.message || "Server Error");
  res.status(err.status || 500);
  res.end();
});