const functions = require('../functions.js');

module.exports = {
	name: 'spongebob',
	description: 'SpOnGeBoB-iFy AnYtHiNg AuToMaTiCaLly',
	usage: '<text to convert>',
	execute(message, commandData) {
		let flipper = 0;
		let newText = '';
		for (const letter of commandData.args) {
			if (flipper == 0) {
				newText = newText + letter.toUpperCase();
				flipper = 1;
			} else {
				newText = newText + letter;
				flipper = 0;
			}
		}
		message.reply(`@${message.author.username}: ${newText}`);
	}
}