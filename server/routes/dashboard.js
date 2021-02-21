const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

router.post("/", authorize, async (req, res) => {
  let id = req.query.id;
  //console.log(id);
  // CHECK IF req.user.id CAN VIEW id (patient's) data!
  id = (typeof(id) === "undefined")? req.user.id : id;
  try {
    const user = await pool.query(
      "SELECT user_name, user_email FROM users WHERE user_id = $1",
      [id] 
    ); 
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;