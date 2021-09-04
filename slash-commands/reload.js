const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reload all saved content, useful if saving something fails.'),
	async execute(interaction) {
		fn.startup.getSlashCommands(client);
		fn.startup.getDotCommands(client);
		fn.startup.setvalidCommands(client);
		fn.startup.getGifFiles(client);
		fn.startup.getPastaFiles(client);
		fn.startup.getPotPhrases(client);
		interaction.reply('Reloaded!');
	},
};