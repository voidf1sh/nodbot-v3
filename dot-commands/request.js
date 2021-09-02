const fn = require('../functions.js');

module.exports = {
	name: 'request',
	description: 'Submit a request to the bot developer.',
	usage: '<request or feedback>',
	execute(message, commandData) {
		const request = commandData.args;
		message.reply(fn.createTextEmbed({ content: 'Your request has been submitted!\nRequest: ' + request }, message.author, commandData.command));
		message.client.users.fetch(process.env.ownerID).then(user => {user.send(fn.textEmbed(request, message.author, commandData.command));}).catch(error => { console.error(error);} );
		fn.uploadRequest(message.author, commandData.args);
	}
}