const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joints')
		.setDescription('Send a list of all the /joint phrases.'),
	async execute(interaction) {
		let joints = [];
		interaction.client.joints.map(e => {
			joints.push(e.content);
		});
		interaction.reply('Here are all the `.joint` phrases I have saved:\n\n' + joints.join('\n'));
	},
};