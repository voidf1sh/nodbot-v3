const fn = require('../functions.js');

module.exports = {
	name: 'pasta',
	description: 'Send a copypasta.',
	usage: '<Copypasta Name>.pasta',
	execute(message, commandData) {
		const client = message.client;
		let replyBody = '';
		let iconUrl;
		if (!client.pastas.has(commandData.args)) {
			commandData.content = 'Sorry I couldn\'t find that pasta.';
		} else {
			commandData.content = client.pastas.get(commandData.args).content;
			commandData.iconUrl = client.pastas.get(commandData.args).iconUrl;
		}
		message.reply(fn.embeds.pasta(commandData));
	}
}