let mysql = require('mysql');
let logger = require('./logger');
require('dotenv').config();

let connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

function connectDB() {
    logger.print('Trying to connect to the database...')
    connection.connect(function(err) {
        if(err) {
            logger.error(err);
            return;
        }
        logger.print('Connected successfully to the database')
    })
}

module.exports = { connectDB }