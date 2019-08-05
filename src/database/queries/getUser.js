// Write a query to get the user and their password from the database
const dbConnection = require('../db_connection')

 const checkUserIfExesit= (email,cb) => {
  dbConnection.query('select * from users where email=1$',[email] ,(error, result) => {
    if (error) return cb(error)
    cb(null, JSON.stringify(result.rows))
  })
}
module.exports=checkUserIfExesit;