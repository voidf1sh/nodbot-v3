const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Send the help page.')
		.addStringOption(option =>
			option.setName('location')
				.setDescription('Send help in this channel or in DMs?')
				.setRequired(true)
				.addChoice('Here', 'channel')
				.addChoice('DMs', 'dm')),
	async execute(interaction) {
		switch (interaction.options.getString('location')) {
		case 'channel':
			await interaction.reply(fn.embeds.help(interaction));
			break;
		case 'dm':
			await interaction.user.createDM().then(channel => {
				channel.send(fn.embeds.help(interaction));
				interaction.reply('I\'ve sent you a copy of my help page.');
			});
			break;
		default:
			interaction.reply('There was an error, please try again.');
			break;
		}
	},
};