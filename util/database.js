let mysql = require('mysql');
let util = require('util');
let logger = require('./logger');
require('dotenv').config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

/**
 * Establishes a connection with the database.
 */
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

/**
 * Saves in the database a new timestamp.
 */
function registerCatalinaPFPChange() {
    connection.query("INSERT INTO `Catalina` (pfp_change) VALUES (CURRENT_TIMESTAMP)", (err, result) => {
        if (err) logger.error(err);
        
        if (result.affectedRows != 1) logger.error("Something went wrong registering Catalina's pfp change.")
        else logger.print("Profile picture change registered successfully.");
    })
}

/**
 * Gets how many times Catalina changed her profile picture in different time spans.
 * @returns Object containing all of the counters, or null if something went wrong.
 */
async function getCatalinaPFPChanges() {
    let query = util.promisify(connection.query).bind(connection);

    //Define the async function that executes the query.
    let getQuery = async () => {
        let result = await query("SELECT * FROM `Catalina`");
        return result;
    }

    //Get the result, and try to parse it.
    let results = await getQuery();
    try {
        let c24 = 0; let c7 = 0; let c30 = 0; let ctotal = 0;
        Object.keys(results).forEach(key => {
            let row = JSON.stringify(results[key]);
            let timestamp = row.substring(row.indexOf('2'), row.lastIndexOf('"'))
            
            let date = new Date(timestamp); 
            let now = new Date();
            let msBetweenDates = Math.abs((date.getTime()+7200000) - now.getTime()); //I need to add 2 hours to the time because of the host timezone. I will change this later...

            let hoursBetweenDate = msBetweenDates / (60 * 60 * 1000);
            if(hoursBetweenDate <= 24) c24++;
            if(hoursBetweenDate <= 168) c7++;
            if(hoursBetweenDate <= 730) c30++;
            ctotal++;
        })

        //Stores the counters in a single object to be able to return all of them.
        var counters = new Object();
        counters.c24 = c24;
        counters.c7 = c7;
        counters.c30 = c30;
        counters.ctotal = ctotal;
        return counters;
    } catch (err) { logger.error(err) }
    
    return null;
}

module.exports = { connectDB, registerCatalinaPFPChange, getCatalinaPFPChanges }