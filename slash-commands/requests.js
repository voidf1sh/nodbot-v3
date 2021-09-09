const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('requests')
		.setDescription('Get a list of Active requests from the database'),
	async execute(interaction) {
		const commandData = {
			author: interaction.user.tag,
			command: interaction.commandName,
			requests: [],
		};
		const requestsMap = interaction.client.requests.map(e => {
			return {
				id: e.id,
				author: e.author,
				request: e.request,
			};
		});
		for (const row of requestsMap) {
			commandData.requests.push({
				id: row.id,
				author: row.author,
				request: row.request,
			});
		}
		interaction.reply(fn.embeds.requests(commandData));
	},
};