const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savepasta')
		.setDescription('Save a copypasta!')
		.addStringOption(option =>
			option.setName('pasta-name')
				.setDescription('What should the name of the copypasta be?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('pasta-content')
				.setDescription('What is the content of the copypasta?')
				.setRequired(true)),
	async execute(interaction) {
		const pastaData = {
			name: interaction.options.getString('pasta-name'),
			content: interaction.options.getString('pasta-content'),
		};
		fn.upload.pasta(pastaData, interaction.client);
		interaction.reply(`The copypasta has been saved as ${pastaData.name}.pasta`);
	},
};