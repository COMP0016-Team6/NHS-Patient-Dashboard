const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

// RENAME THE feed table to feeds
router.post("/", authorize, async (req, res) => {
  let patient_id = req.query.id;

  try {
    const user = await pool.query(
      "SELECT user_name, user_email, patient_gender, patient_age, diagnostic_conclusion FROM patients INNER JOIN users ON patient_id=user_id WHERE patient_id = $1",
      [patient_id] 
    );
    // We expect there to be only one row with the same patient_id
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
    

router.post("/changeTreatmentPlan", authorize, async (req, res) => {
  const { patient_id, description, target_feed_volume, target_feed_energy } = req.body;
  try {
    const newTreatment = await pool.query(
      "INSERT INTO treatments(patient_id, description, target_feed_volume, target_feed_energy) values ($1, $2, $3, $4) RETURNING description, target_feed_volume, target_feed_energy;",
      [patient_id, description, target_feed_volume, target_feed_energy]
    );
   res.json(newTreatment.rows[0]); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/treatmentPlan", authorize, async (req, res) => {
  let patient_id = req.query.id;
  try {
    const treatment = await pool.query(
      "SELECT description, target_feed_volume, target_feed_energy FROM treatments WHERE patient_id = $1;",
      [patient_id]
    );
   res.json(treatment.rows); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
