/* eslint-disable no-undef */
const testPort = ranInt();
process.env.PORT = testPort

const config = {
	launch: {
		product: 'chrome', //or firefox
		headless: true,
		dumpio: false
	},
	server: {
		command: `serve -s -n -l ${testPort} ./examples/`,
		port: testPort,
		launchTimeout: 4000,
	},
	browserContext: 'incognito',
	exitOnPageError: false
};

function ranInt(min = 4000, max = 6000) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
  }

module.exports = config;