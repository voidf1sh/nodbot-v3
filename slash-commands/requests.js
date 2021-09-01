const fn = require('../functions.js');

module.exports = {
	name: 'requests',
	description: 'Get a list of the currently active requests.',
	execute(message, file) {
		fn.getActiveRequests(message);
	}
}