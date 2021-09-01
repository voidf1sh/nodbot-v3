const fn = require('../functions.js');

module.exports = {
	name: 'sendhelp',
	description: 'Send the help message to the current channel',
	permissions: 'BOT_MOD',			// To be implemented later
	execute(message, file) {
		message.reply(fn.createHelpEmbed(message));
	}
}