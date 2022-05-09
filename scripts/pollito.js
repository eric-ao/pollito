const schedule = require('node-schedule');
const logger = require('../util/logger');
const config = require('../config.json')
const lang = require('../lang/es.json')
const {client} = require('../client')

//Schedules the event to wish a good day.
//It will only message those users with the "Amigo de pollito" role.
async function scheduleGM() {
    logger.print(`Scheduling wishing a good day at ${config.good_morning_hour}:00...`)
    schedule.scheduleJob({hour:config.good_morning_hour, minute: 0}, async () => {
        let counter = 0;
        let msg = `Pío pío, buenos dias! ${GMmsgs[Math.floor(Math.random()*GMmsgs.length)]} 🐥`;
        client.guilds.cache.forEach(guild => {
            guild.members.cache.filter(member => member.roles.cache.find(role => role.name === config.role_amigo_pollito))
                .forEach(member => {
                    counter++;
                    member.send(msg)
                        .catch(err => logger.error(err));
                })
        });
        logger.print(`Wished a good day to ${counter} users.`)
    })
}
//Schedules the event to wish a good night.
//It will only message those users with the "Amigo de pollito" role.
async function scheduleGN() {
    logger.print(`Scheduling wishing a good night at ${config.good_night_hour}:00...`)
    schedule.scheduleJob({hour:config.good_night_hour, minute: 00}, async () => {
        let counter = 0;
        let msg = `Pío pío, buenas noches! ${GNmsgs[Math.floor(Math.random()*GNmsgs.length)]} Te quiero mucho, descansa 💤`
        client.guilds.cache.forEach(guild => {
            guild.members.cache.filter(member => member.roles.cache.find(role => role.name === config.role_amigo_pollito))
                .forEach(member => {
                    counter++;
                    member.send(msg)
                        .catch(err => logger.error(err));
                })
        });
        logger.print(`Wished a good night to ${counter} users.`)
    })
}


let GMmsgs = lang.good_morning_msgs;
let GNmsgs = lang.good_night_msgs;

module.exports = { scheduleGM, scheduleGN }