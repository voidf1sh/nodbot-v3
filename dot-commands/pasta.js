const functions = require('../functions.js');

module.exports = {
	name: 'pasta',
	description: 'Send a copypasta.',
	usage: '<Copypasta Name>',
	execute(message, commandData) {
		const client = message.client;
		let replyBody = '';
		let iconUrl;
		if (!client.pastas.has(commandData.args)) {
			replyBody = 'Sorry I couldn\'t find that pasta.';
		} else {
			replyBody = client.pastas.get(commandData.args).content;
			iconUrl = client.pastas.get(commandData.args).iconUrl;
		}
		message.reply(functions.createTextEmbed({ content: replyBody, icon: iconUrl }, message.author, `${commandData.args}.${commandData.command}`));
	}
}