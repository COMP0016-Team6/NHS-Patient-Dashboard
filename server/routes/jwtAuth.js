const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");


router.post("/register", validInfo, async (req, res) => {
  const { email, name, password, role, patient_list } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    // should only check this for clinicians
    let patient_emails = patient_list.split(" ");
    let patient;
    for (var i = 0; i < patient_emails.length; i++) {
      patient = await pool.query("SELECT * FROM users WHERE user_email = $1", [
        patient_emails[i]
      ]);
      if (patient.rows.length == 0) {
        return res.status(401).json(`Patient with ${patient_emails[i]} email address does not exist!`);
      }

      console.log(`${patient_emails[i]} Success`)
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, role]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    let currentUser;
    for (var i = 0; i < patient_emails.length; i++) {
      currentUser = await pool.query("SELECT * FROM users WHERE user_email = $1", [patient_emails[i]]);

      patient = await pool.query(
        "INSERT INTO user_perms (user_id, read, write, patients_scope) VALUES ($1, $2, $3, $4) RETURNING *",
        [newUser.rows[0].user_id, true, true, currentUser.rows[0].user_id]
      );
    }
    
    return res.json({ jwtToken, "user": { user_name: name, user_email: email, user_role: role } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
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
    return res.json({ jwtToken, "user": user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, async (req, res) => {
  try {
    const user = await pool.query("SELECT user_id, user_name, user_email, user_role FROM users WHERE user_id = $1", [
      req.user.id
    ]);
    
    res.json({"auth": true, "user": user.rows[0]});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;