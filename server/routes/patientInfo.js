const router = require("express").Router();
const authorize = require("../middleware/authorize");
const validInfo = require("../middleware/validInfo");
const pool = require("../db");

router.post("/", authorize, async (req, res) => {
  let patient_id = req.query.id;

  const user = await pool.query(
    "SELECT user_id, user_name, user_email, patient_gender, patient_dob, diagnostic_conclusion FROM patients INNER JOIN users ON patient_id=user_id WHERE patient_id = $1",
    [patient_id] 
  );
  const weight = await pool.query(
    "SELECT weight FROM weights WHERE patient_id=$1 ORDER BY timestamp ASC;",
    [patient_id]
  );
  const weight_len = weight.rows.length;
  res.json({ info: user.rows[0], weight: weight.rows[weight_len - 1].weight });
});

router.post("/changeTreatmentPlan", [authorize, validInfo], async (req, res) => {
  const { patient_id, description, target_feed_fluid, target_feed_energy, modified_time } = req.body;
  const newTreatment = await pool.query(
    "INSERT INTO treatments(patient_id, description, target_feed_fluid, target_feed_energy, modified_time) values ($1, $2, $3, $4, $5) RETURNING description, target_feed_fluid, target_feed_energy, modified_time;",
    [patient_id, description, target_feed_fluid, target_feed_energy, modified_time]
  );
  res.json("Success");
});

router.post("/treatmentPlan", authorize, async (req, res) => {
  let patient_id = req.query.id;
  const treatment = await pool.query(
    "SELECT description, target_feed_fluid, target_feed_energy, modified_time FROM treatments WHERE patient_id = $1 ORDER BY modified_time ASC;",
    [patient_id]
  );
  res.json(treatment.rows); 
});

router.post("/changeWeight", [authorize, validInfo], async (req, res) => {
  const { user_id, newWeight } = req.body;
  const new_weight = await pool.query(
    "INSERT INTO weights (patient_id, weight, timestamp) VALUES ($1, $2, $3);",
    [user_id, newWeight, new Date()]
  );
  res.json("Success");
})

module.exports = router;
