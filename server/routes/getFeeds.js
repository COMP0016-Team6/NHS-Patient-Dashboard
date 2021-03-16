const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

router.post("/", authorize, async (req, res) => {
  const { patient_id } = req.body;
  const user = await pool.query(
    "SELECT id, fluid, energy, timestamp, patient_feedback FROM feed WHERE patient_id = $1 ORDER BY timestamp ASC;",
    [patient_id]
  );

  const weight = await pool.query(
    "SELECT weight, timestamp FROM weights WHERE patient_id = $1 ORDER BY timestamp ASC;",
    [patient_id]
  );

  res.json({ feeds: user.rows, weights: weight.rows });
});


router.post("/feedback", authorize, async (req, res) => {
  const { id, feedback } = req.body;
  const feed = await pool.query(
    "UPDATE feed SET patient_feedback = $1 WHERE id = $2 RETURNING *;",
    [feedback, id] 
  );
  res.json(feed.rows[0]);
});

module.exports = router;
