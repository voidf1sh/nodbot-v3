const functions = require('../functions.js');

module.exports = {
	name: 'pastas',
	description: 'Get a list of saved copypastas',
	execute(message, file) {
		message.author.createDM().then(channel => {
			channel.send(functions.createPastaList(message));
			message.reply('I\'ve sent you a DM with a list of saved copypastas.')
		}).catch(err => message.reply('Sorry I was unable to send you a DM.'));
	}
}