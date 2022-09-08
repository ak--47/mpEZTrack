// mpEZTrack
// by AK
// ak@mixpanel.com
// purpose: a quick, no-fuss, and "codeless" implementation of mixpanel that works decently well on most web apps

const u = require('./utils');
const { minify } = require("uglify-js"); // https://github.com/mishoo/UglifyJS
require('dotenv').config(); //https://github.com/motdotla/dotenv

const Mixpanel = require('mixpanel'); //https://github.com/mixpanel/mixpanel-node
const mixpanel = Mixpanel.init(process.env.MP_TOKEN || "0");

const contentType = `text/javascript;charset=UTF-8`;
const cacheStrategy = `public, max-age=604800` //cache for one week

//exposed API
exports.start = async (req, res) => {
	try {
		const params = u.parseParams(req.query); //user given url params		
		const script = exports.main(params);
		try {		
		mixpanel.track('snippet sent', {...params, distinct_id: params.token, ip: req.ip, base: req.baseUrl, url: req.baseUrl });		
		} catch(e) {}
		
		res.set('Content-Type', contentType).set('Cache-Control', cacheStrategy).status(200).send(script);
	} catch (e) {
		console.error(e);
		try {
		mixpanel.track('snippet error', {...req.query, distinct_id: req.query?.token, ip: req.ip, base: req.baseUrl, url: req.baseUrl, error: e});
		} catch(e) {}
		
		const clientError = `console.error(\`EZTrack: Bad Token!\n\ngot: "${req.query?.token || "null"}"\nexpected 32 char string\n\ndouble check your mixpanel project token and try again!\nhttps://developer.mixpanel.com/reference/project-token\`)`;
		res.set('Content-Type', contentType).status(200).send(clientError);
	}
};


exports.main = function(params = {}) {
	const defaultParams = {
		//required
		token: null,

		//processing
		debug: false,
		minify: true,
		logErrors: false,

		//site config
		superProps: true,
		pageViews: true,
		pageExits: false, //will sent transport to 'sendBeacon'
		linkClicks: true,
		buttonClicks: true,
		formSubmits: true,
		userProfiles: true,
		allClicks: false,
		youtube: false
	};

	const clientParams = Object.freeze({ ...defaultParams, ...params });

	// is this good enough token veritifaction?
	if (!clientParams.token || clientParams.token?.length !== 32 ) throw new Error('bad token'); 

	// snippet + deepQuerySelector
	const snippet = ``.concat(u.mpSnippet(), '\n\n', u.shadowDomSelector());
	
	// client implementation
	const init = u.init(clientParams);
	const views = u.trackViews(clientParams);
	const exits = u.trackExits(clientParams);
	const links = u.trackLinks(clientParams);
	const buttons = u.trackButtons(clientParams);
	const forms = u.trackForms(clientParams);
	const profiles = u.trackProfiles(clientParams);	
	const clicks = u.trackClicks(clientParams);
	const youtube = u.trackYoutube(clientParams);
	const clientConfig = ``.concat(init, views, exits, links, buttons, forms, profiles, youtube, clicks).trim();

	const body = snippet.concat('\n\n', clientConfig);

	// payload processing
	let payload = u.iffe(body);
	if (clientParams.minify) {
		payload = minify(payload).code;
	}

	return payload;
}

