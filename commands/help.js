const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../util/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Comandos útiles de Pollito'),

    async execute(interaction) {
        let embed = new MessageEmbed()
                .setColor('#ffde4a')
                .setTitle("Comandos")
                .setDescription(
                    '· **/birthday** - Pollito te felicitará tu cumpleaños\n' + 
                    '· **/rolesmsg** - Mensaje para el rol de *Amigo de Pollito*\n' +
                    '· **/catalina** - Cuantas veces se ha cambiado la foto Catalina\n' +
                    '· **/huevos** - Comprueba cuantos tienes\n\u200B\n'+
                    'Si eres *Amigo de Pollito*, te dirá buenos días y buenas noches todos los días!')
        interaction.reply({embeds: [embed]}).then(() => {
            setTimeout(() => interaction.deleteReply(), 15000);
        }).catch(err => logger.error(err));
    }
}