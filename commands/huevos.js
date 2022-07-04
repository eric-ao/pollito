const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../util/database');
const logger = require('../util/logger')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('huevos')
        .setDescription('Comprueba cuantos huevos te ha dado Pollito'),

    async execute(interaction) {
        logger.print(`Huevos command executed`)

        logger.print("Getting the amount of eggs of the user...")
        let eggs = await database.getHuevos(interaction.user.id);
        let embed = new MessageEmbed()
                .setColor('#f7dece')
                .setDescription(`Tienes ${eggs} 🥚`)

        logger.print("Sending the embed with the amount of eggs...")
        interaction.reply({embeds: [embed]}).then(() => {logger.print("Embed sent successfully!")}).catch(err => {logger.error(err)})
    }
}