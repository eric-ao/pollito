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
        let role = guild.roles.cache.find(role => role.name === config.rol_amigo_pollito)
        if(role === undefined) {
            createRole(guild, config.rol_amigo_pollito, config.rol_amigo_pollito_color);
            createdRolesCounter++;
        } else {
            foundRolesCounter++;
        }
    })

    logger.print(`Checking done!`)
    logger.print(`Checked ${guildsCounter} guilds.`)
    logger.print(`Found ${foundRolesCounter} "${config.rol_amigo_pollito}" roles.`)
    logger.print(`Created ${createdRolesCounter} "${config.rol_amigo_pollito}" roles.`)
}

/**
 * Creates a role in a guild.
 * @param guild - the guild where the role is going to be created.
 * @param role - the name of the role.
 * @param color - the color for the role.
 */
function createRole(guild, role, color) {
    guild.roles.create({
        name: role,
        color: color,
        mentionable: true
    })
    logger.print(`Created the "${role}" role in a guild.`)
}

/**
 * Everytime Pollito joins a new guild, it will automatically create the needed roles.
 */
client.on('guildCreate', guild => {
    logger.print(`Pollito just joined a new guild!`);
    createRole(guild, config.rol_amigo_pollito, config.rol_amigo_pollito_color);
})

module.exports = { checkForRoles }