const functions = require('../functions.js');
const axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://weatherapi-com.p.rapidapi.com/current.json',
  params: {q: ''},
  headers: {
    'x-rapidapi-key': '0b3f85bcb7msh1e6e80e963c9914p1d1934jsnc3542fc83520',
    'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
  }
};

module.exports = {
	name: 'weather',
	description: 'Get the current weather by ZIP code or city name.',
	usage: '<ZIP code, City Name, etc>',
	execute(message, commandData) {
		options.params.q = commandData.args;
		axios.request(options).then(function (response) {
			const embed = functions.createWeatherEmbed(response.data, message.author, `${commandData.args}.${commandData.command}`);
			message.reply(embed).then().catch(err => console.error(err));
		}).catch(function (error) {
			console.error(error);
		});
	}
}