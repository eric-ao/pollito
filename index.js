const {client} = require('./client');           //Bot client.
const schedule = require('./scripts/schedule')  //Schedule module.
const pollito = require('./scripts/pollito')    //Pollito module.
const logger = require('./util/logger');        //Custom logger useful to print timestamps.
const fs = require('fs');                       //File systema module.
const db = require('./util/database');          //Database
require('dotenv').config();                     //Environment variables.

//Loads every command.
const { Collection } = require('discord.js');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(let file of commandFiles) {
    let command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command);
}

// Login to Discord.
client.login(process.env.TOKEN).then(() => logger.print("Bot logged in"));

//Run once Pollito is ready.
client.once("ready", () => {
    logger.print("Bot ready")
    
    db.connectDB();
    
    schedule.scheduleGM();
    schedule.scheduleGN();
    schedule.scheduleBirthdayWish();
    
    pollito.setPresence();
})

//Runs everytime a command is executed.
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    let command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute(interaction);
    } catch(error) {
        logger.error(error);
    }
})