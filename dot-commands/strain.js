const fn = require('../functions');

module.exports = {
	name: 'strain',
	description: 'Search for information about a cannabis strain.',
	usage: '<strain name>.strain',
	execute(message, commandData) {
		commandData.strainName = fn.weed.strain.lookup(commandData.args, message.client);
		if (commandData.strainName) {
			fn.download.strain(commandData, message);
		}
		else {
			commandData.content = 'Sorry, I couldn\'t find a strain with that name: ' + commandData.args;
			message.reply(fn.embeds.text(commandData));
		}
	}
}