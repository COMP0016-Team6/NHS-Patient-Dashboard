const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

/*
  you get the user_id, and return
  a JSON with all the feed information of that patient.
  
  {
    volume: ,
    rate: ,
    timestamp:  
  }

*/ 

// RENAME THE feed table to feeds
router.post("/", authorize, async (req, res) => {
  const {patient_id} = req.body;  
  console.log(`HERE ${JSON.stringify(req.body)}`);
  try {
      const user = await pool.query(
        "SELECT volume, rate, feed_timestamp FROM feed WHERE patient_id = $1",
        [patient_id] 
      ); 
      res.json(user.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  module.exports = router;