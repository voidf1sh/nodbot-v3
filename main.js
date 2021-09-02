// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

// Discord.JS
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Various imports
const fn = require('./functions.js');
const config = require('./config.json');

client.once('ready', () => {
	fn.startup.getSlashCommands(client);
	fn.startup.setvalidCommands(client);
	fn.startup.getGifFiles(client);
	fn.startup.getPastaFiles(client);
	fn.startup.getPotPhrases(client);
	console.log('Ready!');
	client.channels.fetch(config.devChannelId).then(channel => channel.send('Ready!'));
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
	if (message.user.bot) return;
	const commandData = fn.dot.getCommandData(message);
	if (commandData.isValid && commandData.isCommand) {
		try {
			client.commands.get(commandData.command).execute(message, commandData);
		}
		catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute that command.');
		}
	}
    return;
});

client.login(token);