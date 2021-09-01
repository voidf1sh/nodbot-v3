const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('closereq')
		.setDescription('Close a request by ID, retrieved from /requests')
		.addStringOption(option => 
			option.setName('requestid')
				.setDescription('The ID of the request you\'d like to close.')
				.setRequired(true)),
	async execute(interaction) {
		const requestId = interaction.options.getString('requestid');
		if (await fn.closeRequest(requestId)) {
			interaction.reply(`Request #${requestId} closed.`);
		}
		else {
			interaction.reply('I was unable to close the request.');
		}
	},
};