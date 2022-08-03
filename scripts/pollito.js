const schedule = require('node-schedule');
const logger = require('../util/logger');
const config = require('../config.json');
const lang = require('../lang/es.json');
const database = require('../util/database');
const {client} = require('../client');
const { MessageActionRow, MessageButton } = require('discord.js');
require('dotenv').config();



client.on('messageCreate', async message => {
    if (message.channel.type == 'DM' && !message.author.bot) {
        let isFriend = await database.isFriend(message.author.id);

        if(isFriend){
        } else {
            makeFriends(message.author);
        }
    }
 })


function makeFriends(author) {

    let buttons = new MessageActionRow();
    buttons.addComponents(
        new MessageButton()
            .setCustomId('yes')
            .setLabel('Pues claro! 💕')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('no')
            .setLabel('No... ☹️')
            .setStyle('SECONDARY')  
    );

    author.send({content: 'Vaya, parece que aún no somos amigos... ¿Quieres ser mi amigo/a?', components: [buttons] })
    
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	
    if(interaction.customId == 'yes') {
        database.addFriend(interaction, interaction.user.id)
    }
    else if(interaction.customId == 'no') {
        await deleteMessage(interaction)
        interaction.user.send("De acuerdo... Vuelve a hablarme si cambias de idea! 😊")
    }

    
});

async function deleteMessage(interaction) {
    try {
        await interaction.message.delete()
    } catch (err) {
        logger.error(err);
    }
}







function setPresence() {
    logger.print("Setting Pollito's presence...")
    client.user.setPresence(
        { 
            activities: 
                [
                    { name: 'mi Pollito fiu fiu 🐣💕'}
                ],
            status: 'online' 
        }
    )
}

module.exports = { setPresence }