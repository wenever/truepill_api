const mysql = require('mysql2');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PWORD;
const database = process.env.DB_NAME;

const connection = mysql.createConnection({
  host,
  user,
  password,
  database
});

connection.connect((err: Error) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

export = connection;
