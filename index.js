const { Client } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS"], partials: ["CHANNEL", "MESSAGE", "REACTION"]});

client.once("ready", () => {
    console.log("Bot ready")
})

/////////////////////////////////// KEY ////////////////////////////////////
client.login(process.env.TOKEN).then(() => console.log("Bot logged in"));
/////////////////////////////////// KEY ////////////////////////////////////