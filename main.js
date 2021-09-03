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
		'DIRECT_MESSAGE_REACTIONS'
	],
	partials: [
		'CHANNEL',
		'MESSAGE'
	]
});

// Various imports
const fn = require('./functions.js');
const config = require('./config.json');

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
	if (!interaction.isCommand()) return;

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