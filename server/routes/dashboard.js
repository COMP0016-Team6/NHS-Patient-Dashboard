const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

router.post("/", authorize, async (req, res) => {
  let id = req.query.id;
  id = (typeof(id) === "undefined")? req.user.id : id;
  try {
    const user = await pool.query(
      "SELECT user_id, user_name, user_email FROM users WHERE user_id = $1;",
      [id] 
    ); 
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;