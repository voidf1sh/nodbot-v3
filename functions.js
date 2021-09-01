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
const emoji = config.emoji;
const slashCommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));

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
		setValidExtensions(client) {
			for (const entry of client.commands.map(command => command.name)) {
				config.validExtensions.push(entry);
			}
			if (config.isDev) console.log(config.validExtensions);
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
			if (config.isDev) console.log(slashCommandFiles);
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
	help: {
		channel(interaction) {
			const { slashCommands } = interaction.client;
			let fields = [];
			for (const entry of commands.map(command => [command.name, command.description, command.usage])) {
				const name = entry[0];
				const description = entry[1];
				let usage;
				if (entry[2] == undefined) {
					usage = '';
				} else {
					usage = entry[2];
				}
				const excludeList = [
					'kill',
					'mapcommands',
					'newgif',
					'newpng',
					'oldgif',
					'strain',
					'stonk',
					'wrongbad'
				];
				if (excludeList.includes(name)) continue;
				fields.push({
					name: name,
					value: `${description}\n**Usage:** \`${usage}.${name}\``
				});
			}

			return {embeds: [new Discord.MessageEmbed()
				.setAuthor('NodBot Help')
				.setDescription('All commands are provided as "file extensions" instead of prefixes to the message.')
				.addFields(fields)
				.setTimestamp()]};
		},
		dm(interaction) {
			return;
		}
	},
	save: {
		gif(name, embed_url) {
			const query = `INSERT INTO gifs (name, embed_url) VALUES ('${name}', '${embed_url}')`;
			db.query(query);
			this.startup.getGifFiles(); 
		},
		pasta(name, content) {
			const query = `INSERT INTO pastas (name, content) VALUES ('${name}', '${content}')`;
			db.query(query);
		},
		joint(content) {
			const query = `INSERT INTO joints (content) VALUES ('${content}')`;
			db.query(query);
		}
	},
	weed: {
		strain: {
			lookup(strainName) {
				const query = `SELECT * FROM strains WHERE name LIKE ${strainName}`;
				const results = db.query(query).then(res => {
					return res;
				});
				console.log(results);
			},
			submit(strainName) {
				return strainName;
			}
		}
	}
};