const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");


router.post("/register", validInfo, async (req, res) => {
  const { email, name, password, role, dob, gender, diagnosticConclusion, weight } = req.body.inputs;
  const { description, target_feed_fluid, target_feed_energy, modified_time } = req.body.plan;

  const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
    email
  ]);

  if (user.rows.length > 0) {
    return res.status(401).json("User already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  let newUser = await pool.query(
    "INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, bcryptPassword, role]
  );

  const jwtToken = jwtGenerator(newUser.rows[0].user_id);

  if (role === "Patient") {
    const patient = await pool.query(
      "INSERT INTO patients (patient_id, patient_gender, patient_dob, diagnostic_conclusion) VALUES ($1, $2, $3, $4);",
      [newUser.rows[0].user_id, gender, dob, diagnosticConclusion]
    );

    const treatmentPlan = await pool.query(
      "INSERT INTO treatments(patient_id, description, target_feed_fluid, target_feed_energy, modified_time) VALUES ($1, $2, $3, $4, $5);",
      [newUser.rows[0].user_id, description, target_feed_fluid, target_feed_energy, modified_time]
    );

    const new_weight = await pool.query(
      "INSERT INTO weights (patient_id, weight, timestamp) VALUES ($1, $2, $3);",
      [newUser.rows[0].user_id, weight, new Date()]
    );
  }

  return res.json({ jwtToken, "user": { user_id: newUser.rows[0].user_id, user_name: name, user_email: email, user_role: role } });
});

router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
    email
  ]);

  if (user.rows.length === 0) {
    return res.status(401).json("Invalid Credentials!");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.rows[0].user_password
  );

  if (!validPassword) {
    return res.status(401).json("Invalid Credentials!");
  }
  const jwtToken = jwtGenerator(user.rows[0].user_id);
  return res.json({ jwtToken, user: user.rows[0] });
});

router.post("/verify", authorize, async (req, res) => {
  const user = await pool.query("SELECT user_id, user_name, user_email, user_role FROM users WHERE user_id = $1", [
    req.user.id
  ]);
  
  res.json({ "auth": true, "user": user.rows[0] });
});

module.exports = router;