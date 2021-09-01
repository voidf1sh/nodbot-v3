const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gifs')
		.setDescription('DM a list of saved GIFs to the requester.'),
	async execute(interaction) {
		await interaction.user.createDM().then(channel => {
			channel.send(fn.gifs.list());
			interaction.reply('I\'ve sent you a DM with a list of saved GIFs.');
		});
	},
};