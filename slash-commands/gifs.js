const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gifs')
		.setDescription('Get a list of currently saved GIFs.'),
	async execute(interaction) {
		if (!interaction.client.gifs) {
			interaction.reply('For some reason I don\'t have access to the collection of gifs. Sorry about that!');
			return;
		}
		const gifsMap = interaction.client.gifs.map(e => {
			return {
				id: e.id,
				name: e.name,
			};
		});
		const commandData = {
			gifs: [],
			command: 'gifs',
			author: interaction.user.tag,
		};
		for (const row of gifsMap) {
			commandData.gifs.push({
				id: row.id,
				name: row.name,
			});
		}
		interaction.reply(fn.embeds.gifs(commandData));
	},
};