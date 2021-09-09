const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const { emoji } = require('../strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savejoint')
		.setDescription('Save a phrase for /joint!')
		.addStringOption(option =>
			option.setName('joint-content')
				.setDescription('What is the phrase?')
				.setRequired(true)),
	async execute(interaction) {
		fn.upload.joint(interaction.options.getString('joint-content'), interaction.client);
		interaction.reply(`The joint has been rolled${emoji.joint}`);
	},
};