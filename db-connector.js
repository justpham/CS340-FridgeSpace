/*
*   Copied from Activity 2 - Connect Webapp to Database on Feburary 22, 2024 (https://canvas.oregonstate.edu/courses/1946034/assignments/9456203)
*/

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_phamjus',
    password        : '3853',
    database        : 'cs340_phamjus',
    multipleStatements: true
})

// Export it for use in our application
module.exports.pool = pool;