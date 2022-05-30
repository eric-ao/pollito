const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../util/database');
const logger = require('../util/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Dile tu cumpleaños a Pollito para que te felicite!')
        .addSubcommand(subcommand => 
            subcommand
                .setName('add')
                .setDescription('Añade una fecha de cumpleaños')
                .addIntegerOption(option => option.setName('day').setDescription('Día').setRequired(true))
                .addIntegerOption(option => option.setName('month').setDescription('Mes (como número)').setRequired(true))
                )
        .addSubcommand(subcommand => 
            subcommand
                .setName('delete')
                .setDescription('Borra tu fecha de cumpleaños'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('Comprueba cual es tu fecha de cumpleaños registrada')),

    async execute(interaction) {
        //Add birthday date subcommand.
        if(interaction.options.getSubcommand() === 'add') {

            let day = interaction.options.getInteger('day');
            day < 10 ? (day = '0' + day) : '';
            let month = interaction.options.getInteger('month');
            month < 10 ? (month = '0' + month) : '';
            let id = interaction.member.id;

            //Checks if the date is correct.
            var date = Date.parse(`2000-${month}-${day}T00:00:00`);
            if (isNaN(date)) {
                interaction.reply(`Esa fecha no es válida`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
            }
            //Checks if the user has already a registered birthday date. 
            else if (await database.alreadyRegistered(id)) {
                interaction.reply(`Ya tienes una fecha registrada!`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err))
            }
            //Registers the birthday date.
            else {
                database.registerBirthday(interaction, id, day, month);
            }

        } 
        //Delete birthday date command.
        else if(interaction.options.getSubcommand() === 'delete') {
            if(await database.alreadyRegistered(interaction.member.id)) {
                database.deleteBirthday(interaction, interaction.member.id);
            } else {
                interaction.reply(`No tienes ninguna fecha registrada!`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err));
            }
        } 
        //Check birthday date command.
        else if(interaction.options.getSubcommand() === 'check') {
            logger.print("Someone checked its birthday date.");
            let id = interaction.member.id;
            //The user has a registered birthday date.
            if(await database.alreadyRegistered(id)) {
                let responseObj = await database.getBirthdayDate(id);
                interaction.reply(`Tu cumpleaños es el ${responseObj.day} de ${responseObj.month}!`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err));
            } 
            //The user does not have a registered birthday date.
            else {
                interaction.reply(`No tienes ninguna fecha registrada!`).then(() => {
                    setTimeout(() => interaction.deleteReply(), 5000);
                }).catch(err => logger.error(err));
            }
        }
    }
}