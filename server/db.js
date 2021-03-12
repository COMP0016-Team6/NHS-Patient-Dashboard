const Pool = require("pg").Pool;

const pool = new Pool ({
  host: "localhost",
  user: "postgres",
  password: "1qaz2wsx",
  port: 5432,
  database: "application"
});

module.exports = pool;
