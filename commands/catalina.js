const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../util/database');
const logger = require('../util/logger')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catalina')
        .setDescription('¿Cuantas veces se ha cambiado de foto Catalina?'),

    async execute(interaction) {
        logger.print(`Catalina command executed`)

        logger.print(`Recovering the amount of times Catalina changes her profile picture...`)
        let counters = await database.getCatalinaPFPChanges();

        let embed = new MessageEmbed()
                .setColor('#ffde4a')
                .setTitle("Catalina")
                .setDescription(
                    'Veces que se ha cambiado de foto:\n\u200B\n' + 
                    'Últimas 24h: **' + counters.c24 + '**\n' +
                    'Últimos 7d: **' + counters.c7 + '**\n' +
                    'Último mes: **' + counters.c30 + '**\n' +
                    'Total: **' + counters.ctotal + '**\n')

        logger.print("Sending the embed message with the information...")
        interaction.reply({embeds: [embed]}).then(() => {logger.print("Embed message sent successfully!")}).catch(err => logger.error(err))
    }
}