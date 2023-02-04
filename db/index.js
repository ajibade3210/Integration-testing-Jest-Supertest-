require("dotenv").config();
const { Client } = require("pg");
var mysql = require("mysql");

const { DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_, DB_TEST } = process.env;

const db = process.env.NODE_ENV === "test" ? DB_TEST : DB_;

let conn = mysql.createPool({
  host: DB_HOSTNAME, // Replace with your host name
  user: DB_USERNAME, // Replace with your database username
  password: DB_PASSWORD, // Replace with your database password
  database: db, // // Replace with your database Name
});

// conn.connect(function (err) {
//   if (err) throw err;
//   // console.log("Database is connected successfully !");
// });

module.exports = conn;
