/* eslint-disable brace-style */
/* eslint-disable no-inline-comments */
/* eslint-disable indent */
const tenor = require('tenorjs').client({
    'Key': process.env.tenorAPIKey, // https://tenor.com/developer/keyregistration
    'Filter': 'off', // "off", "low", "medium", "high", not case sensitive
    'Locale': 'en_US', // Your locale here, case-sensitivity depends on input
    'MediaFilter': 'minimal', // either minimal or basic, not case sensitive
    'DateFormat': 'D/MM/YYYY - H:mm:ss A', // Change this accordingly
});
const fn = require('../functions');
const { emoji } = require('../strings.json');

module.exports = {
	name: 'savegif',
	description: 'Saves a gif selected from a search to a given filename.',
	usage: '<search query>',
	execute(message, file) {
		const query = file.name;
		message.author.createDM().then(channel => {
			tenor.Search.Query(query, 20)
			.then(res => {
				if (res[0] == undefined) {
					channel.send('Sorry, I wasn\'t able to find a GIF of ' + file.name);
					return;
				}
				let i = 0;
				const data = {
					'name': file.name,
					'embed_url': res[0].media[0].gif.url,
					'author': message.author,
				};
				let embed = fn.createGifEmbed(data, message.author, `${Object.values(file).join('.')}`);

				// Send the first GIF result as an Embed
				channel.send(embed)
					.then(gifBrowser => {
						// Add the initial Reactions to the GIF Browser Embed
						fn.saveGif.browser.setReacts(gifBrowser);
						// Filter the reactions to make sure it's one of the pre-set emojis and is from the command originator.
						const gifBrowserReactionFilter = (reaction, user) => {
							return ((reaction.emoji.name == emoji.next) || (reaction.emoji.name == emoji.confirm) || (reaction.emoji.name == emoji.previous) || (reaction.emoji.name == emoji.cancel)) && user.id == message.author.id && !(user.bot);
						};
						// Create the ReactionCollector using the filter above, and a time limit of 120 seconds
						const gifBrowserReactions = gifBrowser.createReactionCollector({ gifBrowserReactionFilter, time: 120000 });

						// When a Reaction gets through the filter (filter returns 'true')
						gifBrowserReactions.on('collect', (reaction, user) => {
							switch (reaction.emoji.name) {
								case emoji.next:
									if (i < res.length) {
										i++;
									} else {
										channel.send('That\'s the last GIF, sorry!');
										break;
									}
									data.embed_url = res[i].media[0].gif.url;
									embed = fn.createGifEmbed(data, message.author, `${file.name}.${file.extension}`);
									if (gifBrowser.editable) {
										gifBrowser.edit(embed);
									} else {
										channel.send('For some reason I\'m unable to update the GIF, please try again later.');
									}
									break;
								case emoji.confirm:
									fn.saveGif.browser.confirm(channel, message);
									gifBrowserReactions.stop('confirm');
									break;
								case emoji.previous:
									if (i > 0) {
										i--;
									} else {
										gifBrowser.reply('That\'s the first GIF, can\'t go back any further!');
										break;
									}
									data.embed_url = res[i].media[0].gif.url;
									embed = fn.createGifEmbed(data, message.author, `${file.name}.${file.extension}`);
									if (gifBrowser.editable) {
										gifBrowser.edit(embed);
									}
									break;
								case emoji.cancel:
									gifBrowserReactions.stop('cancel');
									break;
								default:
									channel.send('There was an error, sorry.');
									break;
							}
						});

						gifBrowserReactions.on('end', (collected, reason) => {
							switch (reason) {
								case 'cancel':
									gifBrowser.delete();
									channel.send('The action has been canceled.');
									break;
								case 'messageDelete':
									break;
								default:
									break;
							}
						});
					}).catch(err => console.error(err));
			})
			.catch(err => console.error(err));
		});
	},
};