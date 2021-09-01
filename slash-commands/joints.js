const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joints')
		.setDescription('Send a list of all the /joint phrases.'),
	async execute(interaction) {
		await interaction.deferReply();
		let phrases = [];
		for (const phrase of interaction.client.potphrases.map(potphrase => potphrase.content)) {
			phrases.push(phrase);
		}
		interaction.editReply('Here are all the `.joint` phrases I have saved:\n\n' + phrases.join('\n'));
	},
};