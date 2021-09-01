const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const { emoji } = require('../strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joint')
		.setDescription('Replies with a random cannabis-related quote.'),
	async execute(interaction) {
		let phrases = [];
		for (const entry of interaction.client.potphrases.map(potphrase => potphrase.content)) {
			phrases.push(entry);
		}
		const randIndex = Math.floor(Math.random() * phrases.length);
		interaction.reply(`${phrases[randIndex]} ${emoji.joint}`);
	},
};