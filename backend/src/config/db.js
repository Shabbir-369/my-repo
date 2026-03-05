const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool.promise();


// for production, you can use the following code to connect to the database using a connection string:

// const mysql = require("mysql2");

// const pool = mysql.createPool(process.env.DATABASE_URL);

// module.exports = pool.promise();