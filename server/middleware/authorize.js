const jwt = require("jsonwebtoken");
require("dotenv").config();

// this middleware will on continue on if the token is inside the local storage

module.exports = function(req, res, next) {
  // Get token from header
  const authorisation = req.header("Authorization").split(" ");

  if (authorisation.length !== 2) return res.status(400).json({ msg: "bad request" });
  if (authorisation[0] !== "Bearer") return res.status(400).json({ msg: "bad request" });

  const token = authorisation[1];
  
  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    // it is going to give us the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.jwtSecret);
    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ "auth": false, msg: "Token is not valid" });
  }
};