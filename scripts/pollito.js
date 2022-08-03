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
 * It will only message those users that are friend with Pollito.
 */
async function scheduleGM() {
    logger.print(`Scheduling wishing a good day at ${config.good_morning_hour}:00...`)
    schedule.scheduleJob({hour: config.good_morning_hour, minute: 30}, () => {return scheduledJob(`Pío pío, buenos dias! ${GMmsgs[Math.floor(Math.random()*GMmsgs.length)]} 🐥`, "day")});
}

/**
 * Schedules the event to wish a good night.
 * It will only message those users that are friend with Pollito.
 */
async function scheduleGN() {
    logger.print(`Scheduling wishing a good night at ${config.good_night_hour}:00...`)
    schedule.scheduleJob({hour: config.good_night_hour, minute: 0}, () => {return scheduledJob(`Pío pío, buenas noches! ${GNmsgs[Math.floor(Math.random()*GNmsgs.length)]} Te quiero mucho, descansa 💤`, "night")});
}

/**
 * Gets every friend of Pollito and wishes them a good day / night.
 * @param message - message that is gonna be send to the users. 
 * @param time - time of the day of the job.
 */
async function scheduledJob(message, time) {
    let counter = 0;
    let idsDone = [];
    logger.print(`Wishing a good ${time} to all Pollito's friends...`)
    
    let friends = await database.getAllFriends(); 
    
    client.guilds.cache.forEach(guild => {
        guild.members.cache.forEach(member => {
                if(friends.includes(member.id) && !idsDone.includes(member.id)) {
                    counter++;
                    idsDone.push(member.id);
                    member.send(message)
                        .catch(err => logger.error(err));
                }
            })
    });
    logger.print(`Wished a good ${time} to ${counter} users successfully!`)
}

/**
 * Every day, at midnight, Pollito will wish a happy birthday to its friends.
 */
async function scheduleBirthdayWish() {
    logger.print("Scheduling birthdays check...")
    schedule.scheduleJob(`00 ${config.birthday.hour} * * *`, async () => {
        let counter = 0;
        let idsDone = [];
        let birthdays = await database.getBirthdays();
        
        logger.print(`Today is the birthday of ${birthdays.length} users.`)
        logger.print(`Wishing a happy birthday to them...`)

        birthdays.forEach(id => {
            let isFriend = database.isFriend(id);

            if(isFriend) {
                client.guilds.cache.forEach(guild => {
                    //It will only try to find the member once if its in many guilds with Pollito.
                    if(!idsDone.includes(id)) {
                        counter++;
                        idsDone.push(id);
                        let member = guild.members.cache.find(member => member.id == id);
                        member.send(config.birthday.msg).catch(err => logger.error(err));
                    }
                })
            }

            else {
                logger.print("It's someones birthday, but it's not Pollito's friend anymore!")
            }
            
        })
        logger.print(`Wished happy birthday to ${counter} users.`)
    })
}




function setPresence() {
    logger.print("Setting Pollito's presence...")
    client.user.setPresence(
        { 
            activities: 
                [
                    { name: 'mi Pollito fiu fiu 🐣💕'}
                ],
            status: 'online' 
        }
    )
}

module.exports = { scheduleGM, scheduleGN, scheduleBirthdayWish, setPresence }