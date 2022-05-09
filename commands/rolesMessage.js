const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const logger = require('../util/logger');
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolesmsg')
        .setDescription('Envía un mensaje en el que los usuarios pueden reaccionar para ponerse y quitarse roles'),

    async execute(interaction) {
        //If the user doesn't have the Admin Pollito role, they can't use the command.
        if(interaction.member.roles.cache.find(role => role.name === config.roles.admin_pollito.name) === undefined)
            interaction.reply("No tienes permisos.").then(() => {
                setTimeout(() => interaction.deleteReply(), 3000);
            }).catch(err => logger.error(err))
        else {
            //Creates the embed.
            let embed = new MessageEmbed()
                .setColor('#ffde4a')
                .setTitle(config.roles.msg_title)
                .setDescription(
                    'Reacciona para obtener los roles deseados! \n' +
                    '\n🐣 - Amigo de Pollito (te da los buenos días y las buenas noches)\n\u200B'
                ).setFooter('Elimina la reacción para quitarte el rol');

            //Sends the embed and adds the reaction emojis.
            await interaction.channel.send({embeds: [embed]}).then(msg => {
                msg.react(config.roles.amigo_pollito.emoji)
                }).catch(err => logger.error(err));

            //Replies to the command and deletes the reply after 3 seconds.
            interaction.reply("Mensaje enviado!").then(() => {
                setTimeout(() => interaction.deleteReply(), 3000);
                }).catch(err => logger.error(err))
        }
    }
}