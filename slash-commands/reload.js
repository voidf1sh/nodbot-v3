const fn = require('../functions');

module.exports = {
	name: 'reload',
	description: 'Reload saved GIFs, Pastas, Joint Phrases, etc',
	execute(message, file) {
		fn.reload(message.client);
		message.reply('Reload Successful');
	}
}