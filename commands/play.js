const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const logger = require('../util/logger');
const ytdl = require("ytdl-core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Pollito te canta la canción que le pidas :)')
        .addStringOption(option => option.setName('url').setDescription('Link de la canción').setRequired(true)),

    async execute(interaction) {
        //Credits: Grabriel Tanner (https://gabrieltanner.org/)

        guildId = interaction.guildId;
        //The command can't be played in DMs.
        if(guildId == null) {
            interaction.reply(`No puedo cantar aquí!`).then(() => {
                setTimeout(() => {
                    try {
                        interaction.deleteReply()
                    } catch (err) {
                        logger.error(err);
                    }
                }, 5000);
            }).catch(err => logger.error(err))
        }
        else {
            interaction.reply(`Coming soon! :)`).then(() => {
                setTimeout(() => {
                    try {
                        interaction.deleteReply()
                    } catch (err) {
                        logger.error(err);
                    }
                }, 5000);
            }).catch(err => logger.error(err))
            return;

            const voiceChannel = interaction.member.voice.channel;
            //If the user is not on a voice channel, the command does not work.
            if (!voiceChannel) {
                interaction.reply(`Tienes que estar en un canal de voz!`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
                return;
            }

            //Checks if the bot has permissions to join the voice channel and speak in there.
            const permissions = voiceChannel.permissionsFor(interaction.client.user);
            if (!permissions.has("CONNECT")) {
                interaction.reply(`No me puedo meter ahí :(`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
            } else if (!permissions.has("SPEAK")) {
                interaction.reply(`No puedo cantar ahí!`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
            }

            const songInfo = await ytdl.getInfo(interaction.options.getString('url'));
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };

            try {
                let connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                })
                
                
                await voiceChannel.join();
                queueContruct.connection = connection;
                play(voiceChannel, song, interaction);
            } catch (err) {
                logger.error(err);
                interaction.reply(`Algo salió mal :(`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
            }
        }
    }
}

function play(voiceChannel, song, interaction) {
    if (!song) {
        voiceChannel.leave();
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            play(voiceChannel, false);
    }).on("error", err => logger.error(err));

    dispatcher.setVolumeLogarithmic(1);
    interaction.reply(`Cantando: ${song.title}`).catch(err => logger.error(err))
}