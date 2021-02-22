const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

// RENAME THE feed table to feeds
router.post("/", authorize, async (req, res) => {
  const { patient_id } = req.body;
  try {
    const user = await pool.query(
      "SELECT patient_gender, patient_age, diagnostic_conclusion FROM patients WHERE patient_id = $1",
      [patient_id] 
    ); 
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
    

router.post("/changeTreatmentPlan", authorize, async (req, res) => {
  const { patient_id, description, target_feed_volume, target_feed_rate } = req.body;
  try {
    const newTreatment = await pool.query(
      "INSERT INTO treatments(patient_id, description, target_feed_volume, target_feed_rate) values ($1, $2, $3, $4) RETURNING *;",
      [patient_id, description, target_feed_volume, target_feed_rate]
    );
   res.json(newTreatment.rows); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
