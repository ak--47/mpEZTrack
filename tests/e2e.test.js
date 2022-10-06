require('dotenv').config();
const { PROJECT, TOKEN, SECRET, ACCT, PASS, } = process.env;
const eventStream = [];
const profileStream = [];
const TRACK = `https://api-js.mixpanel.com/track/`;
const ENGAGE = `https://api-js.mixpanel.com/engage/`;

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

	await page.goto(`http://localhost:5000?token=${TOKEN}`);
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
		expect(eventStream.flat()).toContainObjectMatching(spec);
	});
});

describe('compenents track properly', () => {

	test('page view tracking', async () => {
		let spec = {
			event: 'page enter',
			properties: {
				token: TOKEN
			}
		};
		expect(eventStream.flat()).toContainObjectMatching(spec);

	});

	test('buttons tracking', async () => {
		await page.click('#normalButton');
		await sleep();
		let normalSpec = { event: 'button click', properties: { "BUTTON → id": "normalButton" } };
		expect(eventStream.flat()).toContainObjectMatching(normalSpec);

		await page.click('#inputButton');
		await sleep();
		let inputSpec = { event: 'button click', properties: { "BUTTON → id": "inputButton" } };
		expect(eventStream.flat()).toContainObjectMatching(inputSpec);

		await page.click('#divButton');
		await sleep();
		let divSpec = { event: 'button click', properties: { "BUTTON → id": "divButton" } };
		expect(eventStream.flat()).toContainObjectMatching(divSpec);

		await page.click('#filePicker');
		await sleep();
		let filePickerSpec = { event: 'button click', properties: { "BUTTON → id": "filePicker" } };
		expect(eventStream.flat()).toContainObjectMatching(filePickerSpec);

		await page.click('#imageButton');
		await sleep();
		let imageButtonSpec = { event: 'button click', properties: { "BUTTON → id": "imageButton" } };
		expect(eventStream.flat()).toContainObjectMatching(imageButtonSpec);

		await page.click('#resetButton');
		await sleep();
		let resetSpec = { event: 'button click', properties: { "BUTTON → id": "resetButton" } };
		expect(eventStream.flat()).toContainObjectMatching(resetSpec);

		await page.click('#submitButton');
		await sleep();
		let submitButtonSpec = { event: 'button click', properties: { "BUTTON → id": "submitButton" } };
		expect(eventStream.flat()).toContainObjectMatching(submitButtonSpec);
	});
});

describe('bad token throws', () => {
	test('page throws the right errors', async () => {
		const errorPage = await browser.newPage();
		errorPage.on("pageerror", function (err) {
			expect(err.message).toEqual(expect.stringContaining(`Error: BAD TOKEN! TRY AGAIN`));
		});
		await errorPage.goto(`http://localhost:5000?token=foo`);
	});
});


async function sleep(ms = 40) {
	await page.waitForTimeout(ms);
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