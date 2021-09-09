const fn = require('../functions');

module.exports = {
	name: 'strain',
	description: 'Search for information about a cannabis strain.',
	usage: '<strain name>.strain',
	execute(message, commandData) {
		commandData.strainName = fn.weed.strain.lookup(commandData.args, message.client);
		fn.download.strain(commandData, message);
	}
}