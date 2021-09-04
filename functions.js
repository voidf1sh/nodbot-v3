/* eslint-disable comma-dangle */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();

// filesystem
const fs = require('fs');

// D.js
const Discord = require('discord.js');

// Various imports
const config = require('./config.json');
const strings = require('./strings.json');
const slashCommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));
const dotCommandFiles = fs.readdirSync('./dot-commands/').filter(file => file.endsWith('.js'));

// PostgreSQL
const pg = require('pg');
const db = new pg.Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});
db.connect();

module.exports = {
	startup: {
		setvalidCommands(client) {
			for (const entry of client.dotCommands.map(command => command.name)) {
				config.validCommands.push(entry);
			}
			if (config.isDev) console.log(config.validCommands);
		},
		getSlashCommands(client) {
			if (!client.slashCommands) client.slashCommands = new Discord.Collection();
			client.slashCommands.clear();
			for (const file of slashCommandFiles) {
				const slashCommand = require(`./slash-commands/${file}`);
				if (slashCommand.data != undefined) {
					client.slashCommands.set(slashCommand.data.name, slashCommand);
				}
			}
			if (config.isDev) console.log(client.slashCommands);
		},
		getDotCommands(client) {
			if (!client.dotCommands) client.dotCommands = new Discord.Collection();
			client.dotCommands.clear();
			for (const file of dotCommandFiles) {
				const dotCommand = require(`./dot-commands/${file}`);
				client.dotCommands.set(dotCommand.name, dotCommand);
			}
			if (config.isDev) console.log(client.dotCommands);
		},
		getGifFiles(client) {
			if (!client.gifs) client.gifs = new Discord.Collection();
			client.gifs.clear();
			const query = 'SELECT name, embed_url FROM gifs';
			return new Promise((resolve, reject) => {
				db.query(query)
					.then(res => {
						for (const row of res.rows) {
							const gif = {
								name: row.name,
								embed_url: row.embed_url
							};
							client.gifs.set(gif.name, gif);
						}
						resolve();
					})
					.catch(err => console.error(err));
			});
		},
		getPotPhrases(client) {
			if (!client.potphrases) client.potphrases = new Discord.Collection();
			client.potphrases.clear();
			const query = 'SELECT id, content FROM potphrases';
			db.query(query)
				.then(res => {
					for (const row of res.rows) {
						const potphrase = {
							id: row.id,
							content: row.content
						};
						client.potphrases.set(potphrase.id, potphrase);
					}
				})
				.catch(err => console.error(err));
		},
		getPastaFiles(client) {
			if (!client.pastas) client.pastas = new Discord.Collection();
			client.pastas.clear();
			const query = 'SELECT name, content, iconurl FROM pastas';
			return new Promise((resolve, reject) => {
				db.query(query)
					.then(res => {
						for (const row of res.rows) {
							const pasta = {
								name: row.name,
								content: row.content,
								iconUrl: row.iconurl
							};
							client.pastas.set(pasta.name, pasta);
						}
						resolve();
					})
					.catch(err => console.error(err));
			});
		},
	},
	dot: {
		getCommandData(message) {
			let commandData = {};
			// Split the message content at the final instance of a period
			const finalPeriod = message.content.lastIndexOf('.');
			if (finalPeriod < 0) {
				commandData.isCommand = false;
				return commandData;
			}
			commandData.isCommand = true;
			commandData.args = message.content.slice(0,finalPeriod);
			commandData.command = message.content.slice(finalPeriod).replace('.','').toLowerCase();
			commandData.author = `${message.author.username}#${message.author.discriminator}`;
			return this.checkCommand(commandData);
		},
		checkCommand(commandData) {
			if (commandData.isCommand) {
				const validCommands = require('./config.json').validCommands;
				commandData.isValid = validCommands.includes(commandData.command);
			}
			else {
				commandData.isValid = false;
				console.error('Somehow a non-command made it to checkCommands()');
			}
			return commandData;
		}
	},
	embeds: {
		help(interaction) {
			// Construct the Help Embed
			const helpEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setAuthor('Help Page')
				.setDescription(strings.help.description)
				.setThumbnail(strings.urls.avatar);

			// Construct the Slash Commands help

			let slashCommandsFields = [];

			const slashCommandsMap = interaction.client.slashCommands.map(e => {
				return {
					name: e.data.name,
					description: e.data.description
				};
			})

			for (const e of slashCommandsMap) {
				slashCommandsFields.push({
					name: `- /${e.name}`,
					value: e.description,
					inline: false,
				});
			}

			// Construct the Dot Commands Help
			let dotCommandsFields = [];

			const dotCommandsMap = interaction.client.dotCommands.map(e => {
				return {
					name: e.name,
					description: e.description,
					usage: e.usage
				};
			});

			for (const e of dotCommandsMap) {
				dotCommandsFields.push({
					name: `- .${e.name}`,
					value: `${e.description}\nUsage: ${e.usage}`,
					inline: false,
				});
			}

			helpEmbed.addField('Slash Commands', strings.help.slash);
			helpEmbed.addFields(slashCommandsFields);
			helpEmbed.addField('Dot Commands', strings.help.dot);
			helpEmbed.addFields(dotCommandsFields);

			return { embeds: [
				helpEmbed
			]};
		},
		gif(commandData) {
			return { embeds: [new Discord.MessageEmbed()
				.setAuthor(`${commandData.args}.${commandData.command}`)
				.setImage(commandData.embed_url)
				.setTimestamp()
				.setFooter(commandData.author)]};
		},
		pasta(commandData) {
			return { embeds: [ new Discord.MessageEmbed()
				.setAuthor(`${commandData.args}.${commandData.command}`)
				.setDescription(commandData.content)
				.setThumbnail(commandData.iconUrl)
				.setTimestamp()
				.setFooter(commandData.author)]};
		},
		pastas(commandData) {
			const pastasArray = [];
			const pastasEmbed = new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setTimestamp()
				.setFooter(commandData.author);

			for (const row of commandData.pastas) {
				pastasArray.push(`#${row.id} - ${row.name}.pasta`);
			}

			const pastasString = pastasArray.join('\n');
			pastasEmbed.setDescription(pastasString);

			return { embeds: [pastasEmbed] };
		},
		gifs(commandData) {
			const gifsArray = [];
			const gifsEmbed = new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setTimestamp()
				.setFooter(commandData.author);

			for (const row of commandData.gifs) {
				gifsArray.push(`#${row.id} - ${row.name}.gif`);
			}

			const gifsString = gifsArray.join('\n');
			gifsEmbed.setDescription(gifsString);

			return { embeds: [gifsEmbed] };
		},
		text(commandData) {
			return { embeds: [new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setDescription(commandData.content)
				.setTimestamp()
				.setFooter(commandData.author)]};
		},
		requests(commandData) {
			const requestsEmbed = new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setTimestamp()
				.setFooter(commandData.author);

			for (const row of commandData.requests) {
				requestsEmbed.addField(
					`#${row.id} - ${row.author}`,
					`Request: ${row.request}`
				);
			}

			return { embeds: [requestsEmbed]};
		},
		strain(commandData) {
			const strainEmbed = new Discord.MessageEmbed()
				.setAuthor(`${commandData.command} #${commandData.strainInfo.id}`)
				.setTimestamp()
				.setFooter(commandData.author);
			const { strainInfo } = commandData;
			strainEmbed.addFields([
				{
					name: 'Strain Name',
					value: `${strainInfo.name}`,
				},
				{
					name: 'Type',
					value: `${strainInfo.type}`,
					inline: true,
				},
				{
					name: 'Effects',
					value: `${strainInfo.effects}`,
					inline: true,
				},
				{
					name: 'Treats',
					value: `${strainInfo.ailments}`,
					inline: true,
				},
				{
					name: 'Flavor',
					value: `${strainInfo.flavor}`,
					inline: true,
				},
			]);

			return { embeds: [ strainEmbed ]};
		},
	},
	collect: {
		gifName(interaction) {
			const gifNameFilter = m => m.author.id == interaction.user.id;
			return interaction.channel.createMessageCollector({ gifNameFilter, time: 30000 });
		},
	},
	upload: {
		request(commandData) {
			const query = `INSERT INTO requests (author, request, status) VALUES ('${commandData.author}','${commandData.args}','Active')`;
			return db.query(query);
		},
		pasta(pastaData) {
			const query = `INSERT INTO pastas (name, content) VALUES ('${pastaData.name}','${pastaData.content}')`;
			return db.query(query);
		},
		joint(content) {
			const query = `INSERT INTO potphrases (content) VALUES ('${content}')`;
			return db.query(query);
		},
		gif(gifData) {
			const query = `INSERT INTO gifs (name, embed_url) VALUES ('${gifData.name}', '${gifData.embed_url}')`;
			return db.query(query);
		}
	},
	download: {
		requests() {
			const query = 'SELECT id, author, request FROM requests WHERE status = \'Active\'';
			return db.query(query);
		},
		pastas() {
			const query = 'SELECT * FROM pastas ORDER BY id ASC';
			return db.query(query);
		},
		gifs() {
			const query = 'SELECT * FROM gifs ORDER BY id ASC';
			return db.query(query);
		},
	},
	weed: {
		strain: {
			lookup(strainName) {
				const query = `SELECT id, name, type, effects, ailment, flavor, similarity(name, '${strainName}') FROM strains ORDER BY 7 DESC LIMIT 1`;
				return db.query(query);
			},
			submit(strainName) {
				return strainName;
			}
		}
	}
};