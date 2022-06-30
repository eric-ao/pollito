const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../util/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('huevos')
        .setDescription('Comprueba cuantos huevos te ha dado Pollito'),

    async execute(interaction) {
        let eggs = await database.getHuevos(interaction.user.id);
        let embed = new MessageEmbed()
                .setColor('#f7dece')
                .setDescription(`Tienes ${eggs} 🥚`)
        interaction.reply({embeds: [embed]})
    }
}