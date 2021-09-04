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
const strings = require('../strings.json');

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
		const prevButton = new MessageButton().setCustomId('prevGif').setLabel('Previous GIF').setStyle('SECONDARY').setDisabled(true);
		// Confirm GIF Button
		const confirmButton = new MessageButton().setCustomId('confirmGif').setLabel('Confirm').setStyle('PRIMARY');
		// Next GIF Button
		const nextButton = new MessageButton().setCustomId('nextGif').setLabel('Next GIF').setStyle('SECONDARY');
		// Cancel Button
		const cancelButton = new MessageButton().setCustomId('cancelGif').setLabel('Cancel').setStyle('DANGER');
		// Put all the above into an ActionRow to be sent as a component of the reply
		const actionRow = new MessageActionRow().addComponents(prevButton, confirmButton, nextButton, cancelButton);

		// Get the query
		const query = interaction.options.getString('query');

		// Search Tenor for the GIF
		tenor.Search.Query(query, '10').then(res => {
			strings.temp.gifs = [];
			strings.temp.gifIndex = 0;
			strings.temp.gifLimit = res.length - 1;
			strings.temp.gifUserId = interaction.user.id;

			if (res[0] == undefined) {
				interaction.reply('Sorry I was unable to find a GIF of ' + query);
				return;
			}
			for (const row of res) {
				strings.temp.gifs.push({
					embed_url: row.media[0].gif.url,
				});
			}
			interaction.reply({ content: strings.temp.gifs[0].embed_url, components: [actionRow] });
		});
	},
};