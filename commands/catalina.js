const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../util/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catalina')
        .setDescription('¿Cuantas veces se ha cambiado de foto Catalina?'),

    async execute(interaction) {
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
        interaction.reply({embeds: [embed]})
    }
}