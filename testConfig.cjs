const config = {
	launch: {
		product: 'chrome', //or firefox
		headless: true,
		dumpio: false
	},
	server: {
		command: 'serve -s -n -l 5000 ./examples/',
		port: 5000,
		launchTimeout: 4000,
	},
	browserContext: 'incognito',
};

module.exports = config;