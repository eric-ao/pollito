const { Client } = require("discord.js");
const client = new Client({
    intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS"],
    partials: ["CHANNEL", "MESSAGE", "REACTION"]}
);
const logger = require('./util/logger')      //Custom logger useful to print timestamps.
require('dotenv').config()                  //Environment variables.


// Login to Discord.
client.login(process.env.TOKEN).then(() => logger.print("Bot logged in"));

//Run once Pollito is ready.
client.once("ready", () => {
    logger.print("Bot ready")
})

