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



/////// EGGS ///////

function addEggs(id, amount) {
    connection.query("SELECT * FROM `Huevos` WHERE user_id = " + id, (err, result) => {
        if (err) logger.error(err);

        if(result) {
            Object.keys(result).forEach(key => {
                let newEggs = result[key].huevos + amount;
                connection.query("UPDATE `Huevos` SET huevos = " + newEggs + " WHERE user_id = " + id, (err, result) => {
                    if (err) logger.error(err);
                
                    if (result.affectedRows != 1) logger.error("Something went wrong adding eggs.")
                })
            })  
        } else {
            connection.query("INSERT INTO `Huevos` (user_id, huevos) VALUES ("+id+","+amount+")", (err, result) => {
                if (err) logger.error(err);
                
                if (result.affectedRows != 1) logger.error("Something went wrong adding eggs.")
            })
        }
    }) 
}

async function getHuevos(id) {
    let query = util.promisify(connection.query).bind(connection);

    //Define the async function that executes the query.
    let getQuery = async () => {
        let result = await query("SELECT * FROM `Huevos` WHERE user_id = " + id);
        return result;
    }

    //Get the result.
    let results = await getQuery();
    let eggs = 0;
    try {
        Object.keys(results).forEach(key => {
            eggs = results[key].huevos;
        })
    } catch (err) { logger.error(err) }

    return eggs;
}

/////// EGGS ///////



////// CATALINA //////

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
            let msBetweenDates = Math.abs((date.getTime()) - now.getTime());

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

////// CATALINA //////





////// BIRTHDAYS //////

/**
 * Registers the birthday date for a user.
 * @param interaction - interaction object from the command.
 * @param id - snowflake id of the user that executed the command.
 * @param day - day of the birthday, selected from the command.
 * @param month - month of the birthday, selected from the command.
 */
function registerBirthday(interaction, id, day, month) {
    connection.query("INSERT INTO `Birthdays` (user_id, day, month) VALUES ("+id+","+day+","+month+")", (err, result) => {
        if (err) logger.error(err);

        if (result.affectedRows != 1) {
            logger.error("Something went wrong registering a new birthday date.");
            interaction.reply("Algo salió mal :(").then(() => {
                setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
        }
        else {
            let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            logger.print(`Someone added its birthday date (${interaction.options.getInteger('day')}/${interaction.options.getInteger('month')}).`);
            interaction.reply(`Tu cumpleaños se ha guardado! (${interaction.options.getInteger('day')} de ${months[month-1]})`).then(() => {
                setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
        }
    })
}

/**
 * Checks if a user already has registered a birthday date.
 * @param id - snowflake id of the user that executed the command.
 * @returns true if birthday date registered, false otherwise.
 */
async function alreadyRegistered(id) {
    let query = util.promisify(connection.query).bind(connection);

    //Define the async function that executes the query.
    let getQuery = async () => {
        let result = await query("SELECT * FROM `Birthdays` WHERE user_id="+id);
        return result;
    }

    //Get the result.
    let results = await getQuery();
    return Object.keys(results).length != 0;
}

/**
 * Gets the birthday date of the user.
 * @param id - snowflake id of the user that executed the command.
 * @returns an object with the day, and the month as text.
 */
async function getBirthdayDate(id) {
    let query = util.promisify(connection.query).bind(connection);

    //Define the async function that executes the query.
    let getQuery = async () => {
        let result = await query("SELECT * FROM `Birthdays` WHERE user_id="+id);
        return result;
    }

    //Get the result.
    let results = await getQuery();
    let retObj;
    try {
        let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        Object.keys(results).forEach(key => {
            retObj = new Object({day: results[key].day, month: months[results[key].month-1]});
        })
    } catch (err) { logger.error(err) }

    return retObj;
}

function deleteBirthday(interaction, id) {
    connection.query("DELETE FROM `Birthdays` WHERE user_id="+id, (err, result) => {
        if (err) logger.error(err);

        if (result.affectedRows != 1) {
            logger.error("Something went wrong registering a new birthday date.");
            interaction.reply("Algo salió mal :(").then(() => {
                setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
        }
        else {
            logger.print("Someone deleted its birthday date.");
            interaction.reply("Día de tu cumpleaños borrado :(").then(() => {
                setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
        }
    });
}

async function getBirthdays() {
    let query = util.promisify(connection.query).bind(connection);

    let day = new Date().getDate()+1;       //Gotta add this temporal solution to the host timezone diff.
    let month = new Date().getMonth() + 1;

    //Define the async function that executes the query.
    let getQuery = async () => {
        let result = await query("SELECT * FROM `Birthdays` WHERE day="+day+" AND month="+month);
        return result;
    }

    //Get the result.
    let results = await getQuery();
    let birthdaysIDs = []
    try {
        Object.keys(results).forEach(key => {
            birthdaysIDs.push(results[key].user_id);
        })
    } catch (err) { logger.error(err) }

    return birthdaysIDs;
}



////// BIRTHDAYS //////



module.exports = { connectDB, registerCatalinaPFPChange, getCatalinaPFPChanges, registerBirthday, alreadyRegistered, getBirthdayDate, deleteBirthday, getBirthdays, addEggs, getHuevos }