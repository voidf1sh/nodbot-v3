const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reload all saved content, useful if saving something fails.'),
	async execute(interaction) {
		fn.startup.getSlashCommands(interaction.client);
		fn.startup.getDotCommands(interaction.client);
		fn.startup.setvalidCommands(interaction.client);
		fn.startup.getGifFiles(interaction.client);
		fn.startup.getPastaFiles(interaction.client);
		fn.startup.getPotPhrases(interaction.client);
		interaction.reply('Reloaded!');
	},
};