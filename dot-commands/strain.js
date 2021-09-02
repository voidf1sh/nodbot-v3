const axios = require('axios').default;
const options = {
	method: 'GET',
	url: 'https://brianiswu-otreeba-open-cannabis-v1.p.rapidapi.com/strains',
	headers: {
		'x-rapidapi-key': '0b3f85bcb7msh1e6e80e963c9914p1d1934jsnc3542fc83520',
		'x-rapidapi-host': 'brianiswu-otreeba-open-cannabis-v1.p.rapidapi.com'
	}
};

module.exports = {
	name: 'strain',
	description: 'Search for information about a cannabis strain. Powered by Otreeba',
	execute(message, commandData) {
		options.url = options.url + '?name=' + commandData.args;
		axios.request(options).then(function (response) {
			console.log(response.data);
		}).catch(function (error) {
			console.error(error);
		});
	}
}