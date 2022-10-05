const config = {
	launch: {
		headless: true
	},
	server: {
		command: 'serve -s -n -l 5000 ./examples/',
		port: 5000,
		launchTimeout: 4000,
	},
	browserContext: 'incognito',
};

module.exports = config;