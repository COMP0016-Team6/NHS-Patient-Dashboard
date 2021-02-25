const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

router.post("/", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT users.user_id, user_name, user_email, patients.patient_age, patients.patient_gender FROM user_perms INNER JOIN users ON user_perms.patients_scope=users.user_id INNER JOIN patients ON users.user_id=patients.patient_id WHERE user_perms.user_id = $1;",
      [req.user.id] 
    ); 
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;