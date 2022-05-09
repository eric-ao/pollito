const {client} = require('../client')
const logger = require('../util/logger')
const config = require('../config.json')

/**
 * Everytime Pollito is started, it will check the guilds for the required roles.
 * In case the guild does not have the roles, Pollito will create them.
 */
function checkForRoles() {
    let foundRolesCounter = 0;
    let createdRolesCounter = 0;
    let guildsCounter = 0;

    logger.print(`Checking on guilds for needed roles...`)

    client.guilds.cache.forEach(guild => {
        guildsCounter++;
        let role = guild.roles.cache.find(role => role.name === config.roles.amigo_pollito.name)
        if(role === undefined) {
            createRole(guild, config.roles.amigo_pollito.name, config.roles.amigo_pollito.color);
            createdRolesCounter++;
        } else {
            foundRolesCounter++;
        }
    })

    logger.print(`Checking done!`)
    logger.print(`Checked ${guildsCounter} guilds.`)
    logger.print(`Found ${foundRolesCounter} "${config.roles.amigo_pollito.name}" roles.`)
    logger.print(`Created ${createdRolesCounter} "${config.roles.amigo_pollito.name}" roles.`)
}

/**
 * Creates a role in a guild.
 * @param guild - the guild where the role is going to be created.
 * @param role - the name of the role.
 * @param color - the color for the role.
 */
async function createRole(guild, role, color) {
    let createdRole = await guild.roles.create({
        name: role,
        color: color,
        mentionable: true
    })
    return createdRole;
}


//Everytime Pollito joins a new guild, it will create the needed roles.
client.on('guildCreate', guild => {
    logger.print(`Pollito just joined a new guild!`);
    logger.print(`Checking for the ${config.roles.amigo_pollito.name} role...`)
    let role = guild.roles.cache.find(role => role.name === config.roles.amigo_pollito.name)
    if(role === undefined) {
        logger.print(`${config.roles.amigo_pollito.name} role not found, creating one...`)
        createRole(guild, config.roles.amigo_pollito.name, config.roles.amigo_pollito.color);
    } else {
        logger.print(`${config.roles.amigo_pollito.name} role found in the new guild!`)
    }
})

//Everytime someone reacts to a message, if the message is the role assignation one, gives the role.
client.on('messageReactionAdd', async (reaction, user) => {
    if(user.bot) return;

    if(reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            logger.error(error);
            return;
        }
    }

    let reacEmoji = reaction.emoji.name;
    let reacMsg = reaction.message;
    let apName = config.roles.amigo_pollito.name;
    let apColor = config.roles.amigo_pollito.color;
    let apEmoji = config.roles.amigo_pollito.emoji;

    if(reacMsg.author.id === client.user.id) {
        if(reacMsg.embeds[0] !== undefined && reacMsg.embeds[0].title === config.roles.msg_title) {
            if(reacEmoji === apEmoji) {
                let role = reacMsg.guild.roles.cache.find(role => role.name === apName)
                if(role === undefined) {
                    role = await createRole(reacMsg.guild, apName, apColor)
                    logger.print(`Created the "${role.name}" role in a guild.`)
                }
                await reacMsg.guild.members.cache.get(user.id).roles.add(role.id);
                logger.print(`Role "${role.name}" added to a user.`)
            }
        }
    }
});
//Everytime someone reacts to a message, if the message is the role assignation one, takes the role.
client.on('messageReactionRemove', async(reaction, user) => {
    if(user.bot) return;

    if(reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            logger.error(error);
            return;
        }
    }

    let reacEmoji = reaction.emoji.name;
    let reacMsg = reaction.message;
    let apName = config.roles.amigo_pollito.name;
    let apEmoji = config.roles.amigo_pollito.emoji;

    if(reacMsg.author.id === client.user.id) {
        if(reacMsg.embeds[0] !== undefined && reacMsg.embeds[0].title === config.roles.msg_title) {
            if(reacEmoji === apEmoji) {
                let role = reacMsg.guild.roles.cache.find(role => role.name === apName)
                if(role !== undefined) {
                    await reacMsg.guild.members.cache.get(user.id).roles.remove(role);
                    logger.print(`Role "${role.name}" removed from a user.`)
                }
            }
        }
    }
})

module.exports = { checkForRoles }