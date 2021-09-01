const functions = require('../functions.js');

module.exports = {
	name: 'roll',
	description: 'Add a phrase to the .joint command',
	usage: '<phrase to save>',
	execute(message, file) {
		functions.uploadPotPhrase(file.name);
		message.reply('"' + file.name + '" has been added to the list');
	}
}