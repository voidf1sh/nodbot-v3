const fn = require('../functions.js');

module.exports = {
	name: 'request',
	description: 'Submit a request to the bot developer.',
	usage: '<request or feedback>.request',
	execute(message, commandData) {
		const request = commandData.args;
		commandData.content = `Your request has been submitted!\nRequest: ${request}`;
		message.reply(fn.embeds.text(commandData));
		commandData.content = `A new request has been submitted by ${message.author.tag}:\n${commandData.args}`;
		message.client.users.fetch(process.env.ownerID).then(user => {
			user.send(fn.embeds.text(commandData));
		}).catch(error => { console.error(error); });
		fn.upload.request(commandData, message.client);
	},
};