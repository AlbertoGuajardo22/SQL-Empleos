const mysql = require('mysql')

const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'root',
        database:'modulo12'
    },
    console.log("Modulo12 DB IS RUNNING")
)

module.exports  = db