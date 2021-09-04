/* eslint-disable no-case-declarations */
/* eslint-disable indent */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

// Discord.JS
const { Client, Intents } = require('discord.js');
const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS',
	],
	partials: [
		'CHANNEL',
		'MESSAGE',
	],
});
const { MessageActionRow, MessageButton } = require('discord.js');

// Various imports
const fn = require('./functions.js');
const config = require('./config.json');
const strings = require('./strings.json');

client.once('ready', () => {
	fn.startup.getSlashCommands(client);
	fn.startup.getDotCommands(client);
	fn.startup.setvalidCommands(client);
	fn.startup.getGifFiles(client);
	fn.startup.getPastaFiles(client);
	fn.startup.getPotPhrases(client);
	console.log('Ready!');
	client.channels.fetch(config.devChannelId).then(channel => {
		channel.send('Ready!');
	});
});

// slash-commands
client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		if (config.isDev) {
			console.log(interaction);
		}
		const { commandName } = interaction;

		if (client.slashCommands.has(commandName)) {
			client.slashCommands.get(commandName).execute(interaction);
		} else {
			interaction.reply('Sorry, I don\'t have access to that command.');
			console.error('Slash command attempted to run but not found: ' + commandName);
		}
	}

	if (interaction.isButton()) {
		// Get some meta info from strings
		const index = strings.temp.gifIndex;
		const limit = strings.temp.gifLimit;
		const buttonId = interaction.component.customId;
		switch (buttonId) {
			case 'prevGif':
				interaction.editReply('prevGif was pressed');
				break;
			case 'confirmGif':
				interaction.update('confirmGif was pressed.');
				break;
			case 'nextGif':
				let newIndex;
				if (index < limit) {
					newIndex = index + 1;
					strings.temp.gifIndex = newIndex;
				}
				if (index == 0) {
					// Previous GIF button
					const prevButton = new MessageButton().setCustomId('previousGif').setLabel('Previous GIF').setStyle('SECONDARY').setDisabled(false);
					// Confirm GIF Button
					const confirmButton = new MessageButton().setCustomId('confirmGif').setLabel('Confirm').setStyle('PRIMARY');
					// Next GIF Button
					const nextButton = new MessageButton().setCustomId('nextGif').setLabel('Next GIF').setStyle('SECONDARY');
					// Cancel Button
					const cancelButton = new MessageButton().setCustomId('cancelGif').setLabel('Cancel').setStyle('DANGER');
					// Put all the above into an ActionRow to be sent as a component of the reply
					const row = new MessageActionRow().addComponents(prevButton, confirmButton, nextButton, cancelButton);

					interaction.update({ content: strings.temp.gifs[newIndex].embed_url, components: [row] });
					break;
				}
				if (newIndex == strings.temp.gifLimit) {
					// Previous GIF button
					const prevButton = new MessageButton().setCustomId('previousGif').setLabel('Previous GIF').setStyle('SECONDARY');
					// Confirm GIF Button
					const confirmButton = new MessageButton().setCustomId('confirmGif').setLabel('Confirm').setStyle('PRIMARY');
					// Next GIF Button
					const nextButton = new MessageButton().setCustomId('nextGif').setLabel('Next GIF').setStyle('SECONDARY').setDisabled();
					// Cancel Button
					const cancelButton = new MessageButton().setCustomId('cancelGif').setLabel('Canceled').setStyle('DANGER');
					// Put all the above into an ActionRow to be sent as a component of the reply
					const row = new MessageActionRow().addComponents(prevButton, confirmButton, nextButton, cancelButton);

					interaction.update({ content: strings.temp.gifs[newIndex].embed_url, components: [row] });
					break;
				}

				interaction.update(strings.temp.gifs[newIndex].embed_url);
				break;
			case 'cancelGif':
				// Previous GIF button
				const prevButton = new MessageButton().setCustomId('previousGif').setLabel('Previous GIF').setStyle('SECONDARY').setDisabled();
				// Confirm GIF Button
				const confirmButton = new MessageButton().setCustomId('confirmGif').setLabel('Confirm').setStyle('PRIMARY').setDisabled();
				// Next GIF Button
				const nextButton = new MessageButton().setCustomId('nextGif').setLabel('Next GIF').setStyle('SECONDARY').setDisabled();
				// Cancel Button
				const cancelButton = new MessageButton().setCustomId('cancelGif').setLabel('Canceled').setStyle('DANGER');
				// Put all the above into an ActionRow to be sent as a component of the reply
				const row = new MessageActionRow().addComponents(prevButton, confirmButton, nextButton, cancelButton);
				interaction.component.setDisabled(true);

				interaction.update({ content: 'Canceled.', components: [row] });
				break;
			default:
				break;
		}
	}
});

// dot-commands
client.on('messageCreate', message => {
	// Some basic checking to prevent running unnecessary code
	if (message.author.bot) return;

	// Wildcard Responses, will respond if any message contains the trigger word(s), excluding self-messages
	if (message.content.includes('big') && message.content.includes('doinks')) message.reply('gang.');
	if (message.content.includes('ligma')) message.reply('ligma balls, goteem');

	const commandData = fn.dot.getCommandData(message);
	console.log(commandData);
	if (commandData.isValid && commandData.isCommand) {
		try {
			client.dotCommands.get(commandData.command).execute(message, commandData);
		}
		catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute that command.');
		}
	}
	return;
});

client.login(token);