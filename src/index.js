import mixpanel from 'mixpanel-browser';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import { superProperties } from './attributes';

const ezTrack = {
	query: querySelectorAllDeep, //this guy can pierce the shadow dom
	init: bootStrapModule,
	bind: function bindTrackers(mp, opts) {
		if (opts.pageView) this.pageView(mp, opts);
		if (opts.pageExit) this.pageExit(mp, opts);
		if (opts.links) this.links(mp, opts);
		if (opts.buttons) this.buttons(mp, opts);
		if (opts.forms) this.forms(mp, opts);
		if (opts.profiles) this.profiles(mp, opts);
		if (opts.youtube) this.youtube(mp, opts);
	},
	pageView: trackPageViews,
	pageExit: trackPageExits,
	buttons: trackButtonClicks,
	links: trackLinkClicks,
	forms: trackFormSubmits,
	clicks: trackAllClicks,
	youtube: trackYoutubeVideos,
	profiles: createUserProfiles,
	//todo?
	spa: beSpaAware,
	defaultOpts: function getDefaultOptions() {
		return {
			debug: true,
			superProps: true,
			pageView: true,
			pageExit: false,
			links: true,
			buttons: true,
			forms: true,
			profiles: true,
			clicks: false,
			youtube: false,
			spa: false
		};
	}

};


function bootStrapModule(token = ``, userSuppliedOptions = {}) {
	// validate token as 32 char string
	if (!token || token?.length !== 32) {
		console.error(`EZTrack: Bad Token!\n\ngot: "${token}"\nexpected 32 char string\n\ndouble check your mixpanel project token and try again!\nhttps://developer.mixpanel.com/reference/project-token`);
		throw new Error(`BAD TOKEN! TRY AGAIN`);
	}

	//gather options
	const defaultOpts = this.defaultOpts();
	const opts = { ...defaultOpts, ...userSuppliedOptions };

	//setup mp
	mixpanel.init(token, {
		debug: opts.debug,
		cross_subdomain_cookie: true,
		persistence: "localStorage",
		api_transport: "XHR",
		ip: true,
		ignore_dnt: true,
		loaded: (mp) => {
			if (opts.superProps) {
				mp.register(superProperties, { persistent: false });
			}
			this.bind(mp, opts);
		}
	}, "ez");

	//expose mixpanel globally
	if (opts.debug) window.mixpanel = mixpanel;

}

function trackPageViews(mp, opts) {

}

function trackPageExits(mp, opts) {

}

function trackButtonClicks(mp, opts) {

}

function trackLinkClicks(mp, opts) {

}

function trackFormSubmits(mp, opts) {

}

function trackAllClicks(mp, opts) {

}

function trackYoutubeVideos(mp, opts) {

}

function createUserProfiles(mp, opts) {

}

function beSpaAware(typeOfSpa) {
	switch (typeOfSpa?.toLowerCase()) {
		case `react`:

			break;
		case `vue`:

			break;
		case `angular`:

			break;
		case `svelte`:

			break;
		case `backbone`:

			break;
		case `ember`:

			break;
		case `meteor`:

			break;
		case `polymer`:

			break;

		default:
			break;
	}
}

//put it in global namespace
window.mpEZTrack = ezTrack;