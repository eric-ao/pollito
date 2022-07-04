const schedule = require('node-schedule');
const logger = require('../util/logger');
const database = require('../util/database');
const {client} = require('../client');
require('dotenv').config();

let connectedIds = []

async function startEggSchedule() {
    logger.print(`Starting the egg system...`)

    //For being in a voice channel for a minute:
    let vcRule = new schedule.RecurrenceRule();
    vcRule.minute = new schedule.Range(0, 59, 1);
    schedule.scheduleJob(vcRule, () => {return inVoiceChannel()});


}

async function inVoiceChannel() {
    logger.print("Checking users that have been on a voice channel for a minute...")
    let connectedIdsCopy = [...connectedIds]
    connectedIds = []
    client.guilds.cache.forEach(guild => {
        guild.members.cache.each(member => {
            if(member.voice.channel && member.voice.channel.guildId === guild.id) {
                if(connectedIdsCopy.includes(member.id)) {
                    logger.print(`Giving ${member.voice.channel.members.size} eggs to a user...`)
                    database.addEggs(member.id, member.voice.channel.members.size);
                }  
                connectedIds.push(member.id);
            }
        })
    })
}

module.exports = { startEggSchedule }