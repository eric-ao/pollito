const schedule = require('node-schedule');
const logger = require('../util/logger');
const config = require('../config.json')
const {client} = require('../client')

//Schedules the event to wish a good day.
//It will only message those users with the "Amigo de pollito" role.
async function scheduleGM() {
    logger.print("Scheduling wishing a good day...")
    schedule.scheduleJob({hour:8, minute: 0}, async () => {
        let counter = 0;
        client.guilds.cache.forEach(guild => {
            guild.members.cache.filter(member => member.roles.cache.find(role => role.name === config.role_amigo_pollito))
                .forEach(member => {
                    counter++;
                    member.send(`Pío pío, buenos dias! ${GMmsgs[Math.floor(Math.random()*mensajesBuenosDias.length)]} 🐥`)
                        .catch(err => logger.error(err));
                })
        });
        logger.print(`Wished a good day to ${counter} users.`)
    })
}
//Schedules the event to wish a good night.
//It will only message those users with the "Amigo de pollito" role.
async function scheduleGN() {
    logger.print("Scheduling wishing a good night...")
    schedule.scheduleJob({hour:22, minute: 0}, async () => {
        let counter = 0;
        client.guilds.cache.forEach(guild => {
            guild.members.cache.filter(member => member.roles.cache.find(role => role.name === config.role_amigo_pollito))
                .forEach(member => {
                    counter++;
                    member.send(`Pío pío, buenas noches! ${GNmsgs[Math.floor(Math.random()*mensajesBuenosDias.length)]} Te quiero mucho, descansa 💤`)
                        .catch(err => logger.error(err));
                })
        });
        logger.print(`Wished a good night to ${counter} users.`)
    })
}


let GMmsgs = [  "Espero que hoy consigas todo lo que te propongas!",
                            "A empezar el día con alegría!",
                            "Te veo muy bien hoy, este va a ser tu día!",
                            "Que tengas un dia increible!",
                            "Presiento que hoy va a ser un gran día"
                         ]
let GNmsgs = ["Espero que hayas tenido un buen día!",
                            "Recuerda, si has tenido un mal día, seguro que mañana es mejor!",
                            "Lo has hecho genial hoy, estoy muy orgulloso!",
                            "Que tengas dulces sueños!",
                            "Ha sido un gran día, pero ahora toca dormir!"
                           ]

module.exports = { scheduleGM, scheduleGN }