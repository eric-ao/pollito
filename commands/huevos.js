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
                .setColor('#ffde4a')
                .setTitle("Huevos")
                .setDescription(`TIenes ${eggs} 🥚!`)
        interaction.reply({embeds: [embed]})
    }
}