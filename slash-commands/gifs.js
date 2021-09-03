const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gifs')
		.setDescription('Get a list of currently saved GIFs.'),
	async execute(interaction) {
		fn.download.gifs().then(res => {
			if (config.isDev) console.log(res.rows);
			const commandData = {
				author: interaction.user.tag,
				command: interaction.commandName,
				gifs: [],
			};
			for (const row of res.rows) {
				commandData.gifs.push({
					id: row.id,
					name: row.name,
				});
			}
			interaction.reply(fn.embeds.gifs(commandData));
		});
	},
};