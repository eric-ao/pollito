const {client} = require('../client')
const logger = require('../util/logger')
const config = require('../config.json')

function checkForRoles() {
    let foundRolesCounter = 0;
    let createdRolesCounter = 0;
    let guildsCounter = 0;

    logger.print(`Checking on guilds for needed roles...`)

    client.guilds.cache.forEach(guild => {
        guildsCounter++;
        let role = guild.roles.cache.find(role => role.name === config.rol_amigo_pollito)
        if(role === undefined) {
            guild.roles.create({
                name: config.rol_amigo_pollito,
                color: [245, 219, 91],
                mentionable: true
            })
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

module.exports = { checkForRoles }