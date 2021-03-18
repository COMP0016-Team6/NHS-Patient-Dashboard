const Pool = require("pg").Pool;

const pool = new Pool ({
  host: "localhost",
  user: "",
  password: "",
  port: 5432,
  database: "application"
});

module.exports = pool;
