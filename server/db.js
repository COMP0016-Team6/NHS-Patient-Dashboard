const Pool = require("pg").Pool;

const pool = new Pool ({
  host: "localhost",
  user: "<YOUR_DATABASE_USER>",
  password: "<YOUR_LOCAL_PASSWORD>",
  port: 5432,
  database: "login"
});

module.exports = pool;
