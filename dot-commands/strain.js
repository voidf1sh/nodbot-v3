const fn = require('../functions');

module.exports = {
	name: 'strain',
	description: 'Search for information about a cannabis strain.',
	usage: '<strain name>.strain',
	execute(message, commandData) {
		fn.weed.strain.lookup(commandData.args).then(res => {
			const row = res.rows[0];
			if (row == undefined) {
				commandData.content = 'I was unable to find that strain, could there be a typo?';
				message.reply(fn.embeds.text(commandData));
				return;
			}
			commandData.strainInfo = {
				id: `${row.id}`,
				name: `${row.name}`,
				type: `${row.type}`,
				effects: `${row.effects}`,
				ailments: `${row.ailment}`,
				flavor: `${row.flavor}`,
			};
			message.reply(fn.embeds.strain(commandData));
		});
	}
}