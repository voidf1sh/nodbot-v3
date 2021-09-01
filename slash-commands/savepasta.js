const functions = require('../functions.js');

module.exports = {
	name: 'savepasta',
	description: 'Saves a copypasta as pasta_name.pasta, just send the pasta name on the first message, and the bot will ask for the actual pasta afterwards.',
	usage: '<Pasta Name>',
	execute(message, file) {
		message.reply(`I'll be saving the next message you send as ${file.name}.pasta\nWhat is the content of the copypasta?`)
			.then(promptMessage => {
				const pastaFilter = pastaMessage => pastaMessage.author == message.author;
				const pastaCollector = promptMessage.channel.createMessageCollector(pastaFilter, { time: 30000, max: 1 });

				pastaCollector.on('collect', pastaMessage => {
					message.reply(functions.savePasta(message, file.name.toLowerCase(), functions.cleanInput(pastaMessage.content)));
				})
			})
			.catch(err => console.error(err));
	}
} 