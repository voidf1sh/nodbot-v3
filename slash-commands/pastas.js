const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pastas')
		.setDescription('Get a list of currently saved copypastas.'),
	async execute(interaction) {
		fn.download.pastas().then(res => {
			if (config.isDev) console.log(res.rows);
			const commandData = {
				author: interaction.user.tag,
				command: interaction.commandName,
				pastas: [],
			};
			for (const row of res.rows) {
				commandData.pastas.push({
					id: row.id,
					name: row.name,
				});
			}
			interaction.reply(fn.embeds.pastas(commandData));
		});
	},
};