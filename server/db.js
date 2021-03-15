const Pool = require("pg").Pool;

const pool = new Pool ({
  host: "localhost",
  user: "daulet",
  password: "Barcateam1",
  port: 5432,
  database: "application"
});

module.exports = pool;
