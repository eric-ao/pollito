const schedule = require('node-schedule');
const logger = require('../util/logger');
const config = require('../config.json');
const lang = require('../lang/es.json');
const database = require('../util/database');
const {client} = require('../client');
require('dotenv').config();

let GMmsgs = lang.good_morning_msgs;
let GNmsgs = lang.good_night_msgs;



/**
 * Schedules the event to wish a good day.
 * It will only message those users with the "Amigo de pollito" role.
 */
async function scheduleGM() {
    logger.print(`Scheduling wishing a good day at ${config.good_morning_hour}:00...`)
    schedule.scheduleJob({hour: config.good_morning_hour, minute: 30}, () => {return scheduledJob(`Pío pío, buenos dias! ${GMmsgs[Math.floor(Math.random()*GMmsgs.length)]} 🐥`, "day")});
}

/**
 * Schedules the event to wish a good night.
 * It will only message those users with the "Amigo de pollito" role.
 */
async function scheduleGN() {
    logger.print(`Scheduling wishing a good night at ${config.good_night_hour}:00...`)
    schedule.scheduleJob({hour: config.good_night_hour, minute: 0}, () => {return scheduledJob(`Pío pío, buenas noches! ${GNmsgs[Math.floor(Math.random()*GNmsgs.length)]} Te quiero mucho, descansa 💤`, "night")});
}

/**
 * Gets every guild member with the role "Amigo de Pollito" and sends them a message.
 * @param message - message that is gonna be send to the users. 
 * @param time - time of the day of the job.
 */
async function scheduledJob(message, time) {
    let counter = 0;
    let idsDone = [];
    client.guilds.cache.forEach(guild => {
        guild.members.cache.filter(member => member.roles.cache.find(role => role.name === config.roles.amigo_pollito.name))
            .forEach(member => {
                if(!idsDone.includes(member.id)) {
                    counter++;
                    idsDone.push(member.id);
                    member.send(message)
                        .catch(err => logger.error(err));
                }
            })
    });
    logger.print(`Wished a good ${time} to ${counter} users.`)
}

async function scheduleBirthdayWish() {
    logger.print("Scheduling birthdays check...")
    schedule.scheduleJob(`00 ${config.birthday.hour} * * *`, async () => {
        let counter = 0;
        let idsDone = [];
        let birthdays = await database.getBirthdays();
        logger.print(`Today is the birthday of ${birthdays.length} users.`)
        birthdays.forEach(id => {
            client.guilds.cache.forEach(guild => {
                //It will only try to find the member once if its in many guilds with Pollito.
                if(!idsDone.includes(id)) {
                    counter++;
                    idsDone.push(id);
                    let member = guild.members.cache.find(member => member.id == id);
                    member.send(config.birthday.msg).catch(err => logger.error(err));
                }
            })
        })
        logger.print(`Wished happy birthday to ${counter} users.`)
    })
}


//Pollito sums 1 everytime Catalina changes her profile picture.
client.on('userUpdate', (oldMember, newMember) => {
    if(newMember.id === process.env.CATA_ID) {
        if(oldMember.avatar !== newMember.avatar) {
            logger.print("Catalina just changed her profile picture!");
            database.registerCatalinaPFPChange();
        } 
    }
})

module.exports = { scheduleGM, scheduleGN, scheduleBirthdayWish }