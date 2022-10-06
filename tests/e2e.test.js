require('dotenv').config();
const { PROJECT, TOKEN, SECRET, ACCT, PASS, PORT } = process.env;
const eventStream = [];
const profileStream = [];
const TRACK = `https://api-js.mixpanel.com/track/`;
const ENGAGE = `https://api-js.mixpanel.com/engage/`;

function stream(type = "event") {
	if (type === "event") return eventStream.flat();
	if (type === "profile") return profileStream.flat();
}

async function sleep(ms = 100) {
	await page.waitForTimeout(ms);
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
		let spec = {
			properties: {
				token: TOKEN
			}
		};
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
		await page.evaluate(()=>{
			const dataList = document.querySelector('#ice-cream-choice')
			dataList.value = "Mint"
			const change = new Event('change'); 
			dataList.dispatchEvent(change)

		})		
		await page.click('#dewey');
		await page.click('#scales');
		await page.click('#wings');
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
					// For some reason TSC doesn't fully recognize result as object of type
					// ExpectationResult
					return (result).pass;
				}).reduce((a, b) => a || b, false);
		}

		const prettyPrinted = {
			received: this.utils.printReceived(received),
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