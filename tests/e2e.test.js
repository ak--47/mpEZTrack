require('dotenv').config();
const { PROJECT, TOKEN, SECRET, ACCT, PASS, PORT } = process.env;
let eventStream = [];
let profileStream = [];
const TRACK = `https://api-js.mixpanel.com/track/`;
const ENGAGE = `https://api-js.mixpanel.com/engage/`;

function stream(type = "event") {
	if (type === "event") return eventStream.flat();
	if (type === "profile") return profileStream.flat();
}

async function sleep(ms = 100) {
	await page.waitForTimeout(ms);
}

function clearStream() {
	eventStream = [];
	profileStream = [];
}

// oy.... https://lightrun.com/answers/facebook-jest-expose-matchers-in-expectextend
const { getMatchers } = require("../node_modules/expect/build/jestMatchersObject");

// DOCS:
// https://github.com/smooth-code/jest-puppeteer#api
// https://jestjs.io/docs/expect

beforeAll(async () => {
	await page.setRequestInterception(true);
	page.on('request', interceptedRequest => {
		if (interceptedRequest.url().includes(TRACK)) {
			const eventData = JSON.parse(decodeURIComponent(interceptedRequest.postData()).split('data=').slice(-1)[0]);
			eventStream.push(eventData);
			interceptedRequest.continue();

		}
		else if (interceptedRequest.url().includes(ENGAGE)) {
			const profileData = JSON.parse(decodeURIComponent(interceptedRequest.postData()).split('data=').slice(-1)[0]);
			profileStream.push(profileData);
			interceptedRequest.continue();

		}
		else {
			interceptedRequest.continue();
		}
	});

	await page.goto(`http://localhost:${PORT}?token=${TOKEN}&port=${PORT}`);
});

describe('do tests work?', () => {
	test('a = a', () => {
		expect(true).toBe(true);
	});
});

describe('loading the tag', () => {
	test('no errors on init', async () => {
		//page will throw if the browser throws
		await expect(page.title()).resolves.toMatch('mpEZTrack E2E test');
	});

	test('valid token bootstraps tracking', async () => {
		await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
		let spec = {
			properties: {
				token: TOKEN
			}
		};
		await sleep()
		expect(stream()).toContainObjectMatching(spec);
	});
});

describe('compenents track properly', () => {

	test('page views', async () => {
		let spec = {
			event: 'page enter', properties: { token: TOKEN }
		};
		expect(stream()).toContainObjectMatching(spec);

	});

	test('buttons', async () => {
		await page.click('#normalButton');
		await page.click('#inputButton');
		await page.click('#divButton');
		await page.click('#filePicker');
		await page.click('#imageButton');
		await page.click('#resetButton');
		await page.click('#submitButton');
		await sleep();
		let normalSpec = { event: 'button click', properties: { "BUTTON → id": "normalButton" } };
		expect(stream()).toContainObjectMatching(normalSpec);
		let inputSpec = { event: 'button click', properties: { "BUTTON → id": "inputButton" } };
		expect(stream()).toContainObjectMatching(inputSpec);
		let divSpec = { event: 'button click', properties: { "BUTTON → id": "divButton" } };
		expect(stream()).toContainObjectMatching(divSpec);
		let filePickerSpec = { event: 'button click', properties: { "BUTTON → id": "filePicker" } };
		expect(stream()).toContainObjectMatching(filePickerSpec);
		let imageButtonSpec = { event: 'button click', properties: { "BUTTON → id": "imageButton" } };
		expect(stream()).toContainObjectMatching(imageButtonSpec);
		let resetSpec = { event: 'button click', properties: { "BUTTON → id": "resetButton" } };
		expect(stream()).toContainObjectMatching(resetSpec);
		let submitButtonSpec = { event: 'button click', properties: { "BUTTON → id": "submitButton" } };
		expect(stream()).toContainObjectMatching(submitButtonSpec);
	});

	test('links', async () => {
		await page.click('#internal');
		await page.click('#domain');
		await page.click('#nohref');
		await page.click('#js');
		await page.click('#external');
		await sleep();
		let internalSpec = { event: 'navigation click', properties: { "LINK → id": "internal" } };
		expect(stream()).toContainObjectMatching(internalSpec);
		let domainSpec = { event: 'navigation click', properties: { "LINK → id": "domain" } };
		expect(stream()).toContainObjectMatching(domainSpec);
		let noHrefSpec = { event: 'navigation click', properties: { "LINK → id": "nohref" } };
		expect(stream()).toContainObjectMatching(noHrefSpec);
		let jsHrefSpec = { event: 'navigation click', properties: { "LINK → id": "js" } };
		expect(stream()).toContainObjectMatching(jsHrefSpec);
		let externalSpec = { event: 'link click', properties: { "LINK → id": "external" } };
		expect(stream()).toContainObjectMatching(externalSpec);
	});

	test('dropdowns', async () => {
		await page.select('#select', 'audi');
		await page.type('#ice-cream-choice', 'Mint');
		await page.focus('#hero');
		await page.click('#dewey');
		await page.click('#scales');
		await page.click('#wings');
		await page.evaluate(() => {
			const colorPicker = document.querySelector('#tail');
			colorPicker.value = "#51d2bc";
			const change = new Event('change');
			colorPicker.dispatchEvent(change);
		});

		await page.evaluate(() => {
			const rangeSlider = document.querySelector('#dubstep');
			rangeSlider.value = '42';
			const change = new Event('change');
			rangeSlider.dispatchEvent(change);
		});
		page.focus('#hero');
		await sleep();

		let selectSpec = { event: 'user selection', properties: { "OPTION → id": "select", "OPTION → user selected": "audi", "OPTION → choices": ["Volvo", "Saab", "Opel", "Audi"] } };
		expect(stream()).toContainObjectMatching(selectSpec);
		let dataListSpec = { event: 'user selection', properties: { "OPTION → id": "ice-cream-choice", "OPTION → user selected": "Mint", "OPTION → choices": ["Chocolate", "Coconut", "Mint", "Strawberry", "Vanilla"] } };
		expect(stream()).toContainObjectMatching(dataListSpec);
		let radioSpec = { event: 'user selection', properties: { "OPTION → id": "dewey", "OPTION → user selected": "dewey" } };
		expect(stream()).toContainObjectMatching(radioSpec);
		let checkBoxSpecOff = { event: 'user selection', properties: { "OPTION → id": "scales", "OPTION → user selected": false } };
		expect(stream()).toContainObjectMatching(checkBoxSpecOff);
		let checkBoxSpecOn = { event: 'user selection', properties: { "OPTION → id": "wings", "OPTION → user selected": true } };
		expect(stream()).toContainObjectMatching(checkBoxSpecOn);
		let colorPickerSpec = { event: 'user selection', properties: { "OPTION → id": "tail", "OPTION → user selected": "#51d2bc" } };
		expect(stream()).toContainObjectMatching(colorPickerSpec);
		let rangeSliderSpec = { event: 'user selection', properties: { "OPTION → id": "dubstep" } };
		expect(stream()).toContainObjectMatching(rangeSliderSpec);
	});

	test('forms', async () => {
		await page.type('#name', 'foo');
		await page.type('#email', 'bar@baz.com');
		await page.click('#submitSimple');

		await page.type('#uname', 'foo bar');
		await page.type('#pass', 'baz password');
		await page.click('#login');

		await sleep();
		let simpleFormSpec = { event: 'form submit', properties: { "FORM → id": "basicForm", "FORM → # inputs": 3 } };
		expect(stream()).toContainObjectMatching(simpleFormSpec);
		let loginFormSpec = { event: 'form submit', properties: { "FORM → id": "loginForm", "FORM → # inputs": 5 } };
		expect(stream()).toContainObjectMatching(loginFormSpec);
		expect(stream()).not.toContainObjectMatching({ properties: { "CONTENT → user content": "baz password" } });
	});

	test('user input', async () => {
		await page.type('#plainInput', 'i am a plain input text box');
		await page.type('#emailInput', 'ak@notmixpanel.com');
		await page.type('#urlInput', 'https://aktunes.com');
		await page.type('#searchInput', 'i am some fancy search terms');
		await page.type('#textarea', 'i am a long text entry field');
		await page.evaluate(() => {
			const change = new Event('change');
			document.querySelector('#textarea').dispatchEvent(change);
		});
		await page.focus('#hero');
		await sleep();

		let plainInputSpec = { event: 'user entered text', properties: { "CONTENT → id": "plainInput", "CONTENT → user content": "i am a plain input text box" } };
		expect(stream()).toContainObjectMatching(plainInputSpec);
		let emailInputSpec = { event: 'user entered text', properties: { "CONTENT → id": "emailInput", "CONTENT → user content": "ak@notmixpanel.com" } };
		expect(stream()).toContainObjectMatching(emailInputSpec);
		let urlInputSpec = { event: 'user entered text', properties: { "CONTENT → id": "urlInput", "CONTENT → user content": "https://aktunes.com" } };
		expect(stream()).toContainObjectMatching(urlInputSpec);
		let searchInputSpec = { event: 'user entered text', properties: { "CONTENT → id": "searchInput", "CONTENT → user content": "i am some fancy search terms" } };
		expect(stream()).toContainObjectMatching(searchInputSpec);
		let textAreaInputSpec = { event: 'user entered text', properties: { "CONTENT → id": "textarea", "CONTENT → user content": "i am a long text entry field" } };
		expect(stream()).toContainObjectMatching(textAreaInputSpec);
	});

	test('page clicks', async () => {
		await page.click('#image');
		await page.click('#gif');
		await page.click('#oneDiv');
		await page.click('#grandchild');
		await page.click("#firstChild");
		await page.click('#secondChild');
		await sleep();

		let clickImgSpec = { event: 'page click', properties: { "ELEM → id": "image", "ELEM → tag (<>)": "<IMG>", "ELEM → source": "https://aktunes.neocities.org/Rick-Astley-Never-Gonna-Give-You-Up.png" } };
		expect(stream()).toContainObjectMatching(clickImgSpec);
		let clickGifSpec = { event: 'page click', properties: { "ELEM → id": "gif", "ELEM → tag (<>)": "<IMG>", "ELEM → source": "https://aktunes.neocities.org/rick.gif" } };
		expect(stream()).toContainObjectMatching(clickGifSpec);
		let noChildSpec = { event: 'page click', properties: { "ELEM → id": "oneDiv", "ELEM → tag (<>)": "<DIV>", "ELEM → text": "never gonna give you up" } };
		expect(stream()).toContainObjectMatching(noChildSpec);
		let grandChildSpec = { event: 'page click', properties: { "ELEM → id": "grandchild", "ELEM → tag (<>)": "<DIV>", "ELEM → text": "grandchild" } };
		expect(stream()).toContainObjectMatching(grandChildSpec);
		let sectionOneSpec = { event: 'page click', properties: { "ELEM → tag (<>)": "<P>", "ELEM → id": "firstChild", "ELEM → text": "with multiple paragraphs" } };
		expect(stream()).toContainObjectMatching(sectionOneSpec);
		let sectionTwoSpec = { event: 'page click', properties: { "ELEM → tag (<>)": "<P>", "ELEM → id": "secondChild", "ELEM → text": "and such" } };
		expect(stream()).toContainObjectMatching(sectionTwoSpec);

	});

	test('video', async () => {
		await page.evaluate(() => {
			try {
				document.querySelector('#htmlvid').play();
			}
			catch (e) { }
		});
		await sleep(1000);
		await page.evaluate(() => {
			try {
				document.querySelector('#htmlvid').pause();
			}
			catch (e) { }
		});
		await sleep();

		let youtubeSpec = { event: "youtube player load", properties: { "VIDEO → length (sec)": 213, "VIDEO → id": "oHg5SJYRHA0", "VIDEO → title": "RickRoll'D" } };
		expect(stream()).toContainObjectMatching(youtubeSpec);
		let videoPlaySpec = { event: "video: play", properties: { "VIDEO → id": "htmlvid", "VIDEO → tag (<>)": "<VIDEO>" } };
		expect(stream()).toContainObjectMatching(videoPlaySpec);
		let videoPauseSpec = { event: "video: pause", properties: { "VIDEO → id": "htmlvid", "VIDEO → tag (<>)": "<VIDEO>" } };
		expect(stream()).toContainObjectMatching(videoPauseSpec);
	}, 5000);

});

describe('sensitive fields are NOT tracked', () => {


	test('credit card', async () => {
		let sampleCCs = ['4833231031483007', '4833248550533335', '4798518084349926', '4798515032429933'];

		await page.evaluate(() => {
			let sampleCCs = ['4833231031483007', '4833248550533335', '4798518084349926', '4798515032429933'];
			for (const ccNum of sampleCCs) {
				const cc = document.querySelector('#creditcard');
				cc.value = ccNum;
				const change = new Event('change');
				cc.dispatchEvent(change);
			}
		});

		await sleep();

		let ccSpec = { event: 'user entered text', properties: { "CONTENT → id": "creditcard", "CONTENT → user content": "******" } };
		expect(stream()).toContainObjectMatching(ccSpec);
		for (const ccNum of sampleCCs) {
			expect(stream()).not.toContainObjectMatching({ properties: { "CONTENT → user content": ccNum } });
		}


	});

	test('social security numbers', async () => {
		let sampleSSNs = ['152-84-3695', '152-36-9654'];

		await page.evaluate(() => {
			let sampleSSNs = ['152-84-3695', '152-36-9654'];
			for (const SSN of sampleSSNs) {
				const cc = document.querySelector('#ssn');
				cc.value = SSN;
				const change = new Event('change');
				cc.dispatchEvent(change);
			}
		});

		await sleep();

		let ssnSpec = { event: 'user entered text', properties: { "CONTENT → id": "ssn", "CONTENT → user content": "******" } };
		expect(stream()).toContainObjectMatching(ssnSpec);
		for (const SSN of sampleSSNs) {
			expect(stream()).not.toContainObjectMatching({ properties: { "CONTENT → user content": SSN } });
		}


	});

	test('obvious passwords', async () => {
		const samplePassword = 'i am a very bad password';
		await page.focus('#obvisecret');
		await page.type('#obvisecret', samplePassword);
		await page.focus('#hero');
		await page.click('#hero')
		await sleep();

		let passSpec = { event: "user entered text", properties: { "CONTENT → id": "obvisecret" } };
		let passSpecFields = { properties: { "CONTENT → user content": samplePassword } };
		expect(stream()).not.toContainObjectMatching(passSpec);
		expect(stream()).not.toContainObjectMatching(passSpecFields);
	});

	test('less obvious passwords', async () => {
		const samplePassword = 'i am ALSO a very bad password';
		await page.focus('#notobvisecret');
		await page.type('#notobvisecret', samplePassword);
		await page.focus('#hero');
		await page.click('#hero')
		await sleep();

		let passSpec = { event: "user entered text", properties: { "CONTENT → id": "notobvisecret" } };
		let passSpecFields = { properties: { "CONTENT → DATA → role-password": samplePassword } };
		expect(stream()).toContainObjectMatching(passSpec);
		expect(stream()).not.toContainObjectMatching(passSpecFields);
		expect(stream()).not.toContainObjectMatching({  event: "user entered text", properties: { "CONTENT → user content": samplePassword } });
	});
});

describe('bad token throws', () => {
	test('page throws the right errors', async () => {
		const errorPage = await browser.newPage();
		errorPage.on("pageerror", function (err) {
			expect(err.message).toEqual(expect.stringContaining(`Error: BAD TOKEN! TRY AGAIN`));
		});
		await errorPage.goto(`http://localhost:${PORT}?token=foo`);
	}, 3000);
});

afterAll(() => {
	console.debug("URL:", `http://localhost:${PORT}?token=${TOKEN}&port=${PORT}`);
});


/** 
 * UTILITY: force change events in the DOM 
 * 
**/

function changeEv(selector) {
	return function () {
		const el = document.querySelector(selector);
		const change = new Event('change');
		el.dispatchEvent(change);
	};
}


/**
 *  UTILITY: toContainObjectMatching(rec, exp)
 *	Deep-match an array of objects against another object.
 *	runs expect().toMatchObject() in a loop; passes if any object in recieved array matches
 *	requires grabbing the internals of expect()
 *	https://github.com/jest-community/jest-extended/issues/146#issuecomment-1212283459	 

**/
expect.extend({
	toContainObjectMatching(received, expected) {
		let matchFound = false;
		if (Array.isArray(received)) {
			matchFound =
				received.map((obj) => {
					const result = getMatchers().toMatchObject.call(this, obj, expected);
					return (result).pass;
				}).reduce((a, b) => a || b, false);
		}

		const prettyPrinted = {
			received: this.utils.printReceived(received.filter(ev => ev.event === (expected?.event || true))),
			expected: this.utils.printExpected(expected),
		};
		return {
			message: () =>
				this.isNot
					? `expected ${prettyPrinted.received} to be list containing no object matching ${prettyPrinted.expected}`
					: `expected ${prettyPrinted.received} to be list containing at least one object matching ${prettyPrinted.expected}`,
			pass: matchFound,
		};
	},
});