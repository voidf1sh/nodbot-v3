const fn = require('../functions');
const tenor = require('tenorjs').client({
    "Key": process.env.tenorAPIKey, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

module.exports = {
	name: 'gif',
	description: 'Send a GIF',
	usage: '<GIF name or Search Query>.gif',
	execute(message, commandData) {
		if (message.deletable) message.delete();
		const client = message.client;
		if (!client.gifs.has(commandData.args)) {
			tenor.Search.Query(commandData.args, 1).then(res => {
				if (res[0] == undefined) {
					message.reply('Sorry I was unable to find a GIF of ' + commandData.args);
					return;
				};
				commandData.embed_url = res[0].media[0].gif.url;
				// message.reply(fn.embeds.gif(commandData));
				message.channel.send(`> ${commandData.author} - ${commandData.args}.gif`);
				message.channel.send(commandData.embed_url);
			}).catch(err => console.error(err));
		} else {
			// message.reply(commandData.args + ' requested by ' + message.author.username + '\n' + client.gifs.get(commandData.args).embed_url);
			commandData.embed_url = client.gifs.get(commandData.args).embed_url;
			// message.reply(fn.embeds.gif(commandData));
			message.channel.send(`> ${commandData.author} - ${commandData.args}.gif`);
			message.channel.send(commandData.embed_url);
		}
	}
}