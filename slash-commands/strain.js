const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('strain')
		.setDescription('Lookup cannabis strain information.')
		.addStringOption(option =>
			option.setName('strain')
				.setDescription('Name of the strain to lookup')
				.setRequired(true)
		),
	async execute(interaction) {
		const strainInfo = fn.weed.strain.lookup(interaction.getString('strain'));
	},
};