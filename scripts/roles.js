const {client} = require('../client')
const logger = require('../util/logger')
const config = require('../config.json')


/**
 * Checks if a guild has certain role, if it doesn't, the role is created.
 * @param guild - where to check 
 * @param roleName - name of the role to look for
 * @param roleColor - color of the role, in case it needs to be created.
 * @returns true in case its found, false otherwise
 */
async function findORcreate(guild, roleName, roleColor) {
    let role = guild.roles.cache.find(role => role.name === roleName)
    if(role === undefined) {
        logger.print(`${roleName} role not found, creating one...`)
        await createRole(guild, roleName, roleColor);
        return false;
    } else {
        logger.print(`${roleName} role found in the new guild!`)
        return true;
    }
}

/**
 * Everytime Pollito is started, it will check the guilds for the required roles.
 * In case the guild does not have the roles, Pollito will create them.
 */
function checkForRoles() {
    let foundAmigoRolesCounter = 0;
    let createdAmigoRolesCounter = 0;
    let foundAdminRolesCounter = 0;
    let createdAdminRolesCounter = 0;
    let guildsCounter = 0;

    logger.print(`Checking on guilds for needed roles...`)

    client.guilds.cache.forEach(guild => {
        guildsCounter++;
        
        if(findORcreate(guild, config.roles.amigo_pollito.name, config.roles.amigo_pollito.color)) foundAmigoRolesCounter++;
        else createdAmigoRolesCounter++;

        if(findORcreate(guild, config.roles.admin_pollito.name, config.roles.admin_pollito.color)) foundAdminRolesCounter++;
        else createdAdminRolesCounter++;
    })

    logger.print(`Checking done!`)
    logger.print(`Checked ${guildsCounter} guilds.`)
    logger.print(`Found ${foundAmigoRolesCounter} "${config.roles.amigo_pollito.name}" roles.`)
    logger.print(`Created ${createdAmigoRolesCounter} "${config.roles.amigo_pollito.name}" roles.`)
    logger.print(`Found ${foundAdminRolesCounter} "${config.roles.admin_pollito.name}" roles.`)
    logger.print(`Created ${createdAdminRolesCounter} "${config.roles.admin_pollito.name}" roles.`)
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
    findORcreate(guild, config.roles.amigo_pollito.name, config.roles.amigo_pollito.color)

    logger.print(`Checking for the ${config.roles.admin_pollito.name} role...`)
    findORcreate(guild, config.roles.admin_pollito.name, config.roles.admin_pollito.color)
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
                findORcreate(guild, apName, apColor)
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