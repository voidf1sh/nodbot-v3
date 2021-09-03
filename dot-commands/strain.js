const fn = require('../functions');

module.exports = {
	name: 'strain',
	description: 'Search for information about a cannabis strain. Powered by Otreeba',
	execute(message, commandData) {
		fn.weed.strain.lookup(commandData.args).then(res => {
			const row = res.rows[0];
			commandData.strainInfo = {
				name: row.name,
				type: row.type,
				effects: row.effects,
				ailments: row.ailments,
				flavor: row.flavor,
			};
			message.reply(fn.embeds.strain(commandData));
		});
	}
}