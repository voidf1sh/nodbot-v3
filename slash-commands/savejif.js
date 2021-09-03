const tenor = require('tenorjs').client({
	'Key': process.env.tenorAPIKey, // https://tenor.com/developer/keyregistration
	'Filter': 'off', // "off", "low", "medium", "high", not case sensitive
	'Locale': 'en_US',
	'MediaFilter': 'minimal',
	'DateFormat': 'D/MM/YYYY - H:mm:ss A',
});

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savegif')
		.setDescription('Search Tenor for a GIF to save')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Search Query')
				.setRequired(true)),
	async execute(interaction) {
		// Previous GIF button
		const prevButton = new MessageButton()
			.setCustomId('previous')
			.setLabel('Previous GIF')
			.setStyle('SECONDARY')
			.setDisabled(true);

		// Confirm GIF Button
		const confirmButton = new MessageButton()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle('PRIMARY');

		// Next GIF Button
		const nextButton = new MessageButton()
			.setCustomId('next')
			.setLabel('Next GIF')
			.setStyle('SECONDARY');

		// Cancel Button
		const cancelButton = new MessageButton()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle('DANGER');

		const row = new MessageActionRow()
			.addComponents(
				prevButton,
				confirmButton,
				nextButton,
				cancelButton,
			);

		// Get the query
		const query = interaction.options.getString('query');
		interaction.reply({ content: `Imagine a GIF embed here. The search term was: ${query}`, components: [row] });
	},
};