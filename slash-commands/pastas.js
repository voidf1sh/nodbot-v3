const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pastas')
		.setDescription('Get a list of currently saved copypastas.'),
	async execute(interaction) {
		if (!interaction.client.pastas) {
			interaction.reply('For some reason I don\'t have access to the collection of copypastas. Sorry about that!');
			return;
		}
		const commandData = {
			author: interaction.user.tag,
			command: interaction.commandName,
			pastas: [],
		};
		const pastasMap = interaction.client.pastas.map(e => {
			return {
				id: e.id,
				name: e.name,
			};
		});
		for (const row of pastasMap) {
			commandData.pastas.push({
				id: row.id,
				name: row.name,
			});
		}
		interaction.reply(fn.embeds.pastas(commandData));
	},
};