// mpEZTrack
// by AK
// ak@mixpanel.com
// purpose: a quick, no-fuss, and "codeless" implementation of mixpanel that works decently well on most web apps

const u = require('./utils');
const { minify } = require("uglify-js"); // https://github.com/mishoo/UglifyJS
const contentType = `text/javascript;charset=UTF-8`;
const cacheStrategy = `public, max-age=604800` //cache for one week

//exposed API
exports.start = async (req, res) => {
	try {
		const params = u.parseParams(req.query); //url params
		const script = main(params);
		res.set('Content-Type', contentType).set('Cache-Control', cacheStrategy).status(200).send(script);
	} catch (e) {
		console.error(e);
		const clientError = `console.error(\`EZTrack: Bad Token!\n\ngot: "${req.query?.token || "null"}"\nexpected 32 char string\n\ndouble check your mixpanel project token and try again!\nhttps://developer.mixpanel.com/reference/project-token\`)`;
		res.set('Content-Type', contentType).status(200).send(clientError);
	}
};


function main(params = {}) {
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

exports.main = main;