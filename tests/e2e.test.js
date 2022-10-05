/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
const { PROJECT, TOKEN, SECRET, ACCT, PASS, } = process.env;
const eventPayloads = [];
const profilePayloads = [];
const TRACK = `https://api-js.mixpanel.com/track/`
const ENGAGE = `https://api-js.mixpanel.com/engage/`

// https://github.com/smooth-code/jest-puppeteer#api
beforeAll(async () => {
	await page.setRequestInterception(true);
	page.on('request', interceptedRequest => {
		if (interceptedRequest.url().includes(TRACK)) {
			const eventData = JSON.parse(decodeURIComponent(interceptedRequest.postData()).split('data=').slice(-1)[0]);
			eventPayloads.push(eventData);
			interceptedRequest.continue();

		}
		else if (interceptedRequest.url().includes(ENGAGE)) {
			const profileData = JSON.parse(decodeURIComponent(interceptedRequest.postData()).split('data=').slice(-1)[0]);
			profilePayloads.push(profileData);
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
});

describe('compenents track properly', () => {

	test('page view tracking', async () => {
		const pageView = eventPayloads.flat().pop();
		expect(pageView).toMatchObject({ event: 'page enter', properties: { token: TOKEN } });

	});

	test('buttons tracking', async () => {
		await page.click('#normalButton');
		await page.waitForTimeout(100);
		const normalButton = eventPayloads.flat().pop();
		expect(normalButton).toMatchObject({ event: 'button click', properties: { token: TOKEN, "BUTTON → id": "normalButton" } });

		await page.click('#inputButton');
		await page.waitForTimeout(100);
		const inputButton = eventPayloads.flat().pop();
		expect(inputButton).toMatchObject({ event: 'button click', properties: { token: TOKEN, "BUTTON → id": "inputButton" } });

		await page.click('#divButton');
		await page.waitForTimeout(100);
		const divButton = eventPayloads.flat().pop();
		expect(divButton).toMatchObject({ event: 'button click', properties: { token: TOKEN, "BUTTON → id": "divButton" } });
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

