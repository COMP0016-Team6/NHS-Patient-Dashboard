const Pool = require("pg").Pool;

const pool = new Pool ({
  host: "localhost",
  user: "postgres",
  password: "kiriyama3rei",
  port: 5432,
  database: "application"
});

module.exports = pool;
