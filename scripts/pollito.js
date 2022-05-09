const schedule = require('node-schedule');
const logger = require('../util/logger');
const config = require('../config.json')
const lang = require('../lang/es.json')
const {client} = require('../client')

let GMmsgs = lang.good_morning_msgs;
let GNmsgs = lang.good_night_msgs;



/**
 * Schedules the event to wish a good day.
 * It will only message those users with the "Amigo de pollito" role.
 */
async function scheduleGM() {
    logger.print(`Scheduling wishing a good day at ${config.good_morning_hour}:00...`)
    scheduleRule.hour = config.good_morning_hour;
    schedule.scheduleJob({hour: config.good_morning_hour, minute: 0}, () => {return scheduledJob(`Pío pío, buenos dias! ${GMmsgs[Math.floor(Math.random()*GMmsgs.length)]} 🐥`, "day")});
}

/**
 * Schedules the event to wish a good night.
 * It will only message those users with the "Amigo de pollito" role.
 */
async function scheduleGN() {
    logger.print(`Scheduling wishing a good night at ${config.good_night_hour}:00...`)
    schedule.scheduleJob({hour: config.good_night_hour, minute: 0}, () => { logger.print("aqui")
        return scheduledJob(`Pío pío, buenas noches! ${GNmsgs[Math.floor(Math.random()*GNmsgs.length)]} Te quiero mucho, descansa 💤`, "night")});
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


module.exports = { scheduleGM, scheduleGN }