const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('requests')
		.setDescription('Get a list of Active requests from the database'),
	async execute(interaction) {
		fn.download.requests().then(res => {
			if (config.isDev) console.log(res.rows);
			const commandData = {
				author: interaction.user.tag,
				command: interaction.commandName,
				requests: [],
			};
			for (const row of res.rows) {
				commandData.requests.push({
					id: row.id,
					author: row.author,
					request: row.request,
				});
			}
			interaction.reply(fn.embeds.requests(commandData));
		});
	},
};