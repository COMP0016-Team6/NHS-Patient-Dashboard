const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool ({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

module.exports = pool;
