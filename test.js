const { main, start } = require('./index.js');
const u = require('./utils');
const esprima = require('esprima'); //https://github.com/jquery/esprima

const whatMostPplWillDo = {
	token: `12345678123456781234567812345678`
}
const allOptsTrue = {
	token: `12345678123456781234567812345678`,
	debug: true,
	minify: true,
	logErrors: true,
	superProps: true,
	pageViews: true,
	pageExits: true,
	linkClicks: true,
	buttonClicks: true,
	formSubmits: true,
	userProfiles: true,
	allClicks: true,
	youtube: true
}
const allOptsFalse = {
	token: `12345678123456781234567812345678`,
	debug: false,
	minify: false,
	logErrors: false,
	superProps: false,
	pageViews: false,
	pageExits: false,
	linkClicks: false,
	buttonClicks: false,
	formSubmits: false,
	userProfiles: false,
	allClicks: false,
	youtube: false
}
const defaultsOpts = {
	token: `12345678123456781234567812345678`,
	debug: false,
	minify: true,
	logErrors: false,
	superProps: true,
	pageViews: true,
	pageExits: false, 
	linkClicks: true,
	buttonClicks: true,
	formSubmits: true,
	userProfiles: true,
	allClicks: false,
	youtube: false
}
const badToken = {
	token: `foo`
}
const noToken = {}

const successCases = [whatMostPplWillDo, allOptsTrue, allOptsFalse, defaultsOpts]
const failCases = [badToken, noToken]

// at least do no harm...
function isJS(testString) {
	let isValid = true;
	try {
	  esprima.parse(testString);
	}
	catch(e) {
	  isValid = false;
	}
	return isValid;
  }

test('do tests work?', () => {
	expect(true).toBe(true);
}); // ikr?


// utils.js
// unit tests

test('snippet legal', () => {
	const isValid = isJS('"use strict";'.concat(u.mpSnippet()));
	expect(isValid).toBe(true);
});

test('deepQuerySelector legal', () => {
	const isValid = isJS('"use strict";'.concat(u.shadowDomSelector()));
	expect(isValid).toBe(true);
});

test('init legal in all cases', () => {
	for (const testCase of successCases) {
		const isValid = isJS('"use strict";'.concat(u.init(testCase)));
		expect(isValid).toBe(true);
	}	
	
});

test('components legal in all cases', () => {
	for (const testCase of successCases) {
		const isValidViews = isJS('"use strict";'.concat(u.trackViews(testCase)));		
		expect(isValidViews).toBe(true);

		const isValidExits = isJS('"use strict";'.concat(u.trackExits(testCase)));
		expect(isValidExits).toBe(true);

		const isValidLinks = isJS('"use strict";'.concat(u.trackLinks(testCase)));
		expect(isValidLinks).toBe(true);

		const isValidButtons = isJS('"use strict";'.concat(u.trackButtons(testCase)));
		expect(isValidButtons).toBe(true);

		const isValidForms = isJS('"use strict";'.concat(u.trackForms(testCase)));
		expect(isValidForms).toBe(true);

		const isValidProfiles = isJS('"use strict";'.concat(u.trackProfiles(testCase)));
		expect(isValidProfiles).toBe(true);

		const isValidClicks = isJS('"use strict";'.concat(u.trackClicks(testCase)));
		expect(isValidClicks).toBe(true);

		const isValidYoutube = isJS('"use strict";'.concat(u.trackYoutube(testCase)));
		expect(isValidYoutube).toBe(true);


	}	
	
	u.trackViews();
	expect().toBe();
});


// index.js
// integration test

test('entire program legal in all cases', () => {
	const goodCases = [whatMostPplWillDo, ...successCases]
	for (const testCase of goodCases) {
		const isLegal = isJS('"use strict";'.concat(main(testCase)));
		expect(isLegal).toBe(true);
	}

	for (const testCase of failCases) {
		const shouldError = () => {
			return main(testCase)
		}

		expect(shouldError).toThrow(Error)
		
	}
	
});


// index.js
// e2e test (kinda)
// see: https://cloud.google.com/functions/docs/testing/test-http

// test('the http server dtrt', () => {

// 	}
	
// });