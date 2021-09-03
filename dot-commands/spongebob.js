const functions = require('../functions.js');
const config = require('../config.json');

module.exports = {
	name: 'spongebob',
	description: 'SpOnGeBoB-iFy AnYtHiNg AuToMaTiCaLly',
	usage: '<text to convert>.spongebob',
	execute(message, commandData) {
		let flipper = 0;
		let newText = '';
		for (const letter of commandData.args) {
			if (letter == ' ') return;
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