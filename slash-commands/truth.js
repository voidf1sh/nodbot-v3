const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('truth')
		.setDescription('The truth about the MHallihan Flight Simulator'),
	async execute(interaction) {
		await interaction.reply('https://www.twitch.tv/hochmania/clip/EsteemedSlickDootStinkyCheese-hncmP8aIP8_WQb_a?filter=clips&range=all&sort=time');
	},
};