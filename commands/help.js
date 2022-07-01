const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../util/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Comandos útiles de Pollito'),

    async execute(interaction) {
        let eggs = await database.getHuevos(interaction.user.id);
        let embed = new MessageEmbed()
                .setColor('#ffde4a')
                .setTitle("Comandos")
                .setDescription(
                    '· **/birthday** - Pollito te felicitará tu cumpleaños\n' + 
                    '· **/rolesmsg** - Mensaje para el rol de *Amigo de Pollito*\n' +
                    '· **/catalina** - Cuantas veces se ha cambiado la foto Catalina\n' +
                    '· **/huevos** - Comprueba cuantos tienes')
        interaction.reply({embeds: [embed]})
    }
}