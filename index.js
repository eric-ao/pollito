const {client} = require('./client');       //Bot client.
const logger = require('./util/logger')     //Custom logger useful to print timestamps.
const roles = require('./scripts/roles')
require('dotenv').config()                  //Environment variables.


// Login to Discord.
client.login(process.env.TOKEN).then(() => logger.print("Bot logged in"));

//Run once Pollito is ready.
client.once("ready", () => {
    logger.print("Bot ready")
    roles.checkForRoles();
})