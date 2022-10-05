/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// https://github.com/smooth-code/jest-puppeteer#api
require('dotenv').config();
const { PROJECT, TOKEN, SECRET, ACCT, PASS, } = process.env;

describe('do tests work?', () => {
	test('a = a', () => {
		expect(true).toBe(true);
	});
});

describe('loading the tag', () => {
	beforeAll(async () => {
		await page.goto(`http://localhost:5000?token=${TOKEN}`);
	});


	test('page throws no errors', async () => {
		await expect(page.title()).resolves.toMatch('mpEZTrack E2E test');
	});

});

describe('bad token', () => {
	test('page throws the right errors', async () => {
		const errorPage = await browser.newPage()
		errorPage.on("pageerror", function(err) {  
			expect(err.message).toEqual(expect.stringContaining(`Error: BAD TOKEN! TRY AGAIN`))
		})
		await errorPage.goto(`http://localhost:5000?token=foo`);
	});
});