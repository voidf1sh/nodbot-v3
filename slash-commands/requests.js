const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('requests')
		.setDescription('Get a list of Active requests from the database'),
	async execute(interaction) {
		commandData.requests = fn.download.requests();
		interaction.reply(fn.embeds.requests(commandData));
	},
};