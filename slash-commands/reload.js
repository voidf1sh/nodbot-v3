const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reload all saved content, useful if saving something fails.'),
	async execute(interaction) {
		const { client } = interaction;
		fn.collections.slashCommands(client);
		fn.collections.dotCommands(client);
		fn.collections.setvalidCommands(client);
		fn.download.gifs(client);
		fn.download.pastas(client);
		fn.download.joints(client);
		fn.download.requests(client);
		fn.download.strains(client);
		interaction.reply('Reloaded!');
	},
};