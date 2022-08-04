let mysql = require('mysql');
let util = require('util');
let logger = require('./logger');
require('dotenv').config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    supportBigNumbers: true,
    bigNumberStrings: true
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



////// FRIENDS //////

async function getAllFriends() {
    let query = util.promisify(connection.query).bind(connection);

    let getQuery = async () => {
        let result = await query("SELECT * FROM `Friends` WHERE friend=true");
        return result;
    }

    logger.print("Getting all Pollito's friends...")
    let results = await getQuery();

    let friends = []
    try {
        logger.print("Trying to get the IDs from its friends...")
        Object.keys(results).forEach(key => {
            friends.push(results[key].user_id);
        })
        logger.print("Friends IDs recovered successfully!")
    } catch (err) { logger.error(err) }

    return friends;
}

async function isFriend(id) {
    let query = util.promisify(connection.query).bind(connection);

    let getQuery = async () => {
        let result = await query("SELECT * FROM `Friends` WHERE friend = true AND user_id="+id);
        return result;
    }

    logger.print("Checking if a user is friends with Pollito...")
    
    //Get the result.
    let results = await getQuery();
    return Object.keys(results).length != 0;
}

function addFriend(interaction, id) {
    logger.print("Adding a new user to Pollito's friend list...")

    connection.query("INSERT INTO `Friends` (user_id, friend) VALUES ("+id+", true)", (err, result) => {
        if (err) logger.error(err);

        if (result.affectedRows != 1) {
            logger.error("Something went wrong adding a new friend.");

            try {
                interaction.message.delete()
            } catch (err) {
                logger.error(err);
            }
            interaction.user.send("Uy... Me he equivocado, intentemoslo de nuevo! 😣")
        }
        else {
            logger.print("Friend added successfully!")

            try {
                interaction.message.delete()
            } catch (err) {
                logger.error(err);
            }

            interaction.user.send("Genial! Me alegro mucho de que seamos amigos! 🥰")
        }
    })

}


////// FRIENDS //////




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
            logger.print(`Birthday date registered (${interaction.options.getInteger('day')}/${interaction.options.getInteger('month')}).`);
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
        let result;
        try {
            result = await query("SELECT * FROM `Birthdays` WHERE user_id="+id);
            logger.print("Birthday date registered for a user recovered successfully!")
        } catch(error) { logger.error(error) }
        
        return result;
    }

    //Get the result.
    let results = await getQuery();
    let retObj;
    try {
        logger.print("Trying to convert the birthday date recovered from the database...")
        let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        Object.keys(results).forEach(key => {
            retObj = new Object({day: results[key].day, month: months[results[key].month-1]});
        })
        logger.print("Birthday date converted successfully!")
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
            logger.print("Birthday date deleted.");
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



module.exports = { connectDB, getAllFriends, registerBirthday, alreadyRegistered, getBirthdayDate, deleteBirthday, getBirthdays, isFriend, addFriend }