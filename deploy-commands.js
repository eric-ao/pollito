const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const logger = require('./util/logger');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        logger.print('Refreshing slash commands...');

        //Guild commands:
        //await rest.put(
        //    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.CAC_ID),
        //    { body: commands },
        //);

        //Global commands:
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands},
        );

        logger.print("Slash commands refreshed!");
    } catch (error) {
        logger.error(error)
    }
})();