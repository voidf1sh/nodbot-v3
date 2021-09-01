const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check that the bot is alive and responding.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};