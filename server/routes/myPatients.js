const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

router.post("/add", authorize, async (req, res) => {
    const { patient_list } = req.body;
  
    try {
      let patient_emails = patient_list.split(" ");
      let patient_ids = [];
      let patient;
      for (var i = 0; i < patient_emails.length; i++) {
          patient = await pool.query("SELECT * FROM users WHERE user_email = $1", [
          patient_emails[i]
          ]);
          patient_ids.push(patient.rows[0].user_id);
          if (patient.rows.length == 0) {
            return res.status(401).json(`Patient with ${patient_emails[i]} email address does not exist!`);
          }
      }

      for (var i = 0; i < patient_emails.length; i++) {
        // NOT  ALL THE PERMISSIONS WILL BE WRITE TRUE - pass these in the request body
        patient = await pool.query(
          "INSERT INTO user_perms (user_id, read, write, patients_scope) VALUES ($1, $2, $3, $4) RETURNING *",
          [req.user.id, true, true, patient_ids[i]]
        );
      }
      
      return res.json({"result": "success"});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

router.post("/getAll", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_id, user_name, user_email FROM users WHERE user_role=$1;",
      ["Patient"]
    ); 
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/", authorize, async (req, res) => {
    try {
      const user = await pool.query(
        "SELECT users.user_id, user_name, user_email FROM user_perms INNER JOIN users ON user_perms.patients_scope=users.user_id WHERE user_perms.user_id = $1;",
        [req.user.id] 
      ); 
      res.json(user.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

module.exports = router;
