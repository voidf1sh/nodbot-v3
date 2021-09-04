const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lenny')
		.setDescription('( ͡° ͜ʖ ͡°)'),
	async execute(interaction) {
		await interaction.channel.send('( ͡° ͜ʖ ͡°)');
	},
};