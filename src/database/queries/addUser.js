const db_connection = require("../db_connection");
const addUser = (email, password, cb) => {
  db_connection.query(
    "INSERT INTO users (email,password) values ($1, $2)",
    [email, password],
    error => {
      if (error) {
        console.log(error)
        cb(error)
      } else {
        cb(null)
      }
    }
  );
};
module.exports = addUser;