const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const { emoji } = require('../strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joint')
		.setDescription('Replies with a random cannabis-related quote.'),
	async execute(interaction) {
		let joints = [];
		for (const entry of interaction.client.joints.map(joint => joint.content)) {
			joints.push(entry);
		}
		const randIndex = Math.floor(Math.random() * joints.length);
		interaction.reply(`${joints[randIndex]} ${emoji.joint}`);
	},
};