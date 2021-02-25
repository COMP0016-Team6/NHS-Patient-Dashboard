const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(express.json())
app.use(cors())

// ROUTES

// register and login route
app.use("/auth", require("./routes/jwtAuth"));

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

// getPatients
app.use("/getPatients", require("./routes/getPatients"));

// getFeeds for a patient
app.use("/getFeeds", require("./routes/getFeeds"));

// information about the patient
app.use("/patientInfo", require("./routes/patientInfo"));


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});