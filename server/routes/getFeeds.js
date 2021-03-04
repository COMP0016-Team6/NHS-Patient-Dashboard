const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

/*
  you get the user_id, and return
  a JSON with all the feed information of that patient.
  
  {
    volume: ,
    energy: ,
    timestamp:  
  }

*/ 

// RENAME THE feed table to feeds
router.post("/", authorize, async (req, res) => {
  const {patient_id} = req.body;
  console.log(`HERE ${JSON.stringify(req.body)}`);
  try {
      const user = await pool.query(
        "SELECT volume, energy, timestamp FROM feed WHERE patient_id = $1 ORDER BY timestamp ASC;",
        [patient_id] 
      );

      const weight = await pool.query(
        "SELECT weight, timestamp FROM weights WHERE patient_id = $1 ORDER BY timestamp ASC;",
        [patient_id]
      );

      res.json({ feeds: user.rows, weights: weight.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  module.exports = router;