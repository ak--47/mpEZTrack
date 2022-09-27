import mixpanel from 'mixpanel-browser';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import {
	BLACKLIST_ELEMENTS,
	SUPER_PROPS, STANDARD_FIELDS,
	LINK_SELECTORS, LINK_FIELDS,
	BUTTON_SELECTORS, BUTTON_FIELDS,
	FORM_SELECTORS, FORM_FIELDS,
	DROPDOWN_SELECTOR, DROPDOWN_FIELDS,
	INPUT_SELECTOR, INPUT_FIELDS,
	ALL_SELECTOR, ANY_TAG_FIELDS,
	YOUTUBE_SELECTOR,
	LISTENER_OPTIONS
} from './attributes';

export const ezTrack = {
	// entry
	init: entryPoint,

	// stateful stuff
	loadTimeUTC: Date.now(),
	numActions: 0,
	isFirstVisit: true,
	token: "",
	priorVisit: firstVisitChecker,
	debug: () => { mixpanel.ez.set_config({ debug: true }); },

	// dom stuff
	domElementsTracked: [],
	superProps: {},
	host: document.location.host,
	bind: bindTrackers,
	query: querySelectorAllDeep, //this guy can pierce the shadow dom		
	getProps: getSuperProperties,

	// spa stuff
	spa: singlePageAppTracking,
	spaPipe: spaPipeline,

	// dom query stuff
	buttons: listenForButtonClicks,
	links: listenForLinkClicks,
	forms: listenForFormSubmits,
	selectors: listenForDropDownChanges,
	inputs: listenForUserInput,
	clicks: listenForAllClicks,

	// tracking stuff
	buttonTrack: trackButtonClick,
	linkTrack: trackLinkClick,
	formTrack: trackFormSubmit,
	selectTrack: trackDropDownChange,
	inputTrack: trackInputChange,
	clickTrack: trackAnyClick,

	// video stuff
	youtube: trackYoutubeVideos,

	// window stuff
	pageView: trackPageViews,
	pageExit: trackPageExits,
	window: trackWindowStuff,
	error: trackErrors,
	clipboard: trackClipboard,
	profiles: createUserProfiles,

	// default stuff
	defaultOpts: getDefaultOptions
};

/*
-----
SETUP
-----
*/

export function entryPoint(token = ``, userSuppliedOptions = {}, forceTrue = false) {
	// validate token as 32 char string
	if (!token || token.length !== 32) {
		console.error(`EZTrack: Bad Token!\n\ngot: "${token}"\nexpected 32 char string\n\ndouble check your mixpanel project token and try again!\nhttps://developer.mixpanel.com/reference/project-token`);
		throw new Error(`BAD TOKEN! TRY AGAIN`);
	}
	this.token = token;

	// gather options
	const defaultOpts = this.defaultOpts();
	const opts = { ...defaultOpts, ...userSuppliedOptions };

	// overloading init()
	if (forceTrue) {
		for (let key in opts) {
			if (typeof opts[key] === 'boolean') opts[key] = true;
			if (typeof opts[key] === 'number') opts[key] = 0;
		}
		opts.spa = false;
		if (forceTrue === "nodebug") opts.debug = false;
		if (forceTrue === "spa") opts.spa = true;
	}

	this.opts = Object.freeze(opts);

	// do mixpanel
	try {
		mixpanel.init(token, {
			debug: opts.debug,
			cross_subdomain_cookie: true,
			persistence: "localStorage",
			api_transport: "XHR",
			ip: opts.location,
			ignore_dnt: true,
			batch_flush_interval_ms: opts.refresh,
			loaded: (mp) => {
				//props on every event
				try {
					const superProps = this.getProps(token, opts);
					if (opts.debug) this.superProps = superProps;
					mp.register(superProps, { persistent: false });
				}
				catch (e) {
					if (opts.debug) {
						console.error('mpEZTrack failed to setup super properties!');
						console.log(e);
					}
				}

				try {
					this.bind(mp, opts);
				}
				catch (e) {
					if (opts.debug) {
						console.error('mpEZTrack failed bind to the DOM!');
						console.log(e);
					}
				}
			}
		}, "ez");

		//expose mixpanel globally
		if (opts.extend) window.mixpanel = mixpanel;
	}

	catch (e) {
		if (opts.debug) console.log(e);
	}
}

export function getDefaultOptions() {
	return {
		//meta
		debug: false,
		extend: false,
		refresh: 5000,
		location: true,

		//default on
		superProps: true,
		pageView: true,
		pageExit: true,
		links: true,
		buttons: true,
		forms: true,
		profiles: true,
		selectors: true,

		//default off
		inputs: false,
		clicks: false,
		youtube: false,
		window: false,
		clipboard: false,
		firstPage: false,
		error: false,

		//undocumented, for ez debugging
		logProps: false,

		//wips
		spa: false

	};
}

export function getSuperProperties(token = this.token, opts = this.opts) {
	let result = {};
	if (opts.superProps) result = { ...SUPER_PROPS, ...result };
	if (opts.firstPage) result = { ...this.priorVisit(token, opts), ...result };
	return result;

}

export function bindTrackers(mp, opts) {
	try {
		//these options work on all pages
		if (opts.pageView) this.pageView(mp, opts);
		if (opts.pageExit) this.pageExit(mp, opts);
		if (opts.window) this.window(mp, opts);
		if (opts.error) this.error(mp, opts);
		if (opts.clipboard) this.clipboard(mp, opts);
		if (opts.profiles) this.profiles(mp, opts);

		//SPA mode tracks all clicks and then figure out the elements
		if (opts.spa) {
			this.spa(mp, opts);
		}
		//Normal mode queries the DOM directly and sets up listeners on page loade
		else {
			if (opts.buttons) this.buttons(mp, opts);
			if (opts.forms) this.forms(mp, opts);
			if (opts.selectors) this.selectors(mp, opts);
			if (opts.inputs) this.inputs(mp, opts);
			if (opts.links) this.links(mp, opts);
			if (opts.youtube) this.youtube(mp, opts);
			//this should always be last as it is the most general form of tracking for non spas
			if (opts.clicks) this.clicks(mp, opts);
		}
	}
	catch (e) {
		if (opts.debug) console.log(e);
	}

}

export function statefulProps() {
	ezTrack.numActions += 1;

	//https://stackoverflow.com/a/8028584
	const scrollPercent =
		(
			(document.documentElement.scrollTop + document.body.scrollTop) /
			(document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100
		)
		|| 0;

	return {
		"SESSION → time on page (sec)": (Date.now() - ezTrack.loadTimeUTC) / 1000,
		"PAGE → # actions": ezTrack.numActions,
		"PAGE → scroll (%)": Number(scrollPercent.toFixed(2))
	};
}

//default: off
export function firstVisitChecker(token = this.token, opts = this.opts, timeoutMins = 30) {
	if (opts.firstPage) {
		try {
			const firstVisitTime = localStorage.getItem(`MPEZTrack_First_Visit_${token}`);
			const timeout = 60000 * timeoutMins;

			if (firstVisitTime === null) {
				localStorage.setItem(`MPEZTrack_First_Page_${token}`, this.loadTimeUTC);
				return { "DEVICE → first visit?": true };
			}

			// 30 minute timeout
			else if (this.loadTimeUTC - firstVisitTime <= timeout) {
				return { "DEVICE → first visit?": true };
			}

			else {
				this.isFirstVisit = false;
				return { "DEVICE → first visit?": false };
			}

		}

		catch (e) {
			if (opts.debug) console.log(e);
			return { "DEVICE → first visit?": "unknown" };
		}
	}

	else {
		return {};
	}
}

/*
-------------
HTML ELEMENTS
-------------
*/

//default: on
export function trackPageViews(mp, opts) {
	mp.track('page enter', { ...statefulProps() });
	// if (opts.pageExit) mp.time_event('page exit');
}

//default: on
export function trackPageExits(mp, opts) {
	window.addEventListener('beforeunload', () => {
		mp.track('page exit', { ...statefulProps() }, { transport: 'sendBeacon', send_immediately: true });
	});
}

//default: on
export function listenForButtonClicks(mp, opts) {

	const buttons = uniqueNodes(this.query(BUTTON_SELECTORS))
		.filter(node => node.tagName !== 'LABEL') //button is not a label
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const button of buttons) {
		this.domElementsTracked.push(button);
		button.addEventListener('click', (ev) => {
			try {
				this.buttonTrack(ev, mp, opts);
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}


//default: on
export function listenForLinkClicks(mp, opts) {
	const links = uniqueNodes(this.query(LINK_SELECTORS))
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const link of links) {
		this.domElementsTracked.push(link);
		link.addEventListener('click', (ev) => {
			try {
				this.linkTrack(ev, mp, opts);
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}


//default: on
export function listenForFormSubmits(mp, opts) {
	const forms = uniqueNodes(this.query(FORM_SELECTORS));
	for (const form of forms) {
		this.domElementsTracked.push(form);
		form.addEventListener('submit', (ev) => {
			try {
				this.formTrack(ev, mp, opts);
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

//default: on
export function listenForDropDownChanges(mp, opts) {
	let allDropdowns = uniqueNodes(this.query(DROPDOWN_SELECTOR))
		.filter(node => node.tagName !== 'LABEL') //not a label
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const dropdown of allDropdowns) {
		this.domElementsTracked.push(dropdown);
		dropdown.addEventListener('change', (ev) => {
			try {
				this.selectTrack(ev, mp, opts);
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

//default: off
export function listenForUserInput(mp, opts) {
	let inputElements = uniqueNodes(this.query(INPUT_SELECTOR))
		.filter(node => node.tagName !== 'LABEL') //not a label
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const input of inputElements) {
		this.domElementsTracked.push(input);
		input.addEventListener('change', (ev) => {
			try {
				this.inputTrack(ev, mp, opts);
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

//default: off  🚨 guard against sensitive fields 🚨
export function listenForAllClicks(mp, opts) {
	let allThings = uniqueNodes(
		this.query(ALL_SELECTOR)
			.filter(node => node.childElementCount === 0) //most specific
			.filter(node => !this.domElementsTracked.some(el => el === node)) //not already tracked
			.filter(node => !this.domElementsTracked.some(trackedEl => trackedEl.contains(node))) //not a child of already tracked
			.filter(node => !this.domElementsTracked.some(trackedEl => node.parentNode === trackedEl)) //immediate parent is not already tracked
			.filter(node => node.tagName !== 'LABEL') //not a label
			.filter(node => (!node.matches(BLACKLIST_ELEMENTS))) //isn't classified as sensitive
	);


	for (const thing of allThings) {
		this.domElementsTracked.push(thing);
		thing.addEventListener('click', (ev) => {
			try {
				this.clickTrack(ev, mp, opts);
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

/*
----
SPAS
-----
*/

//default: off
export function singlePageAppTracking(mp, opts) {
	window.addEventListener("click", (ev) => {
		figureOutWhatWasClicked.call(ezTrack, ev.target, ev, mp, opts);
	}, LISTENER_OPTIONS);
}

export function spaPipeline(directive = 'none', ev, mp, opts) {
	if (opts.buttons && directive === 'button') this.buttonTrack(ev, mp, opts);
	else if (opts.links && directive === 'link') this.linkTrack(ev, mp, opts);
	else if (opts.forms && directive === 'form') this.formTrack(ev, mp, opts);
	else if (opts.selectors && directive === 'select') this.selectTrack(ev, mp, opts);
	else if (opts.inputs && directive === 'input') this.inputTrack(ev, mp, opts);
	//this should always be last as it is the most general form of tracking
	else if (opts.clicks && directive === 'all') this.clickTrack(ev, mp, opts);
}


/*
---------
TRACKERS
--------
*/


export function trackButtonClick(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "BUTTON"),
		...BUTTON_FIELDS(src),
		...statefulProps()
	};

	mp.track('button click', props);
	if (opts.logProps) console.log('BUTTON CLICK'); console.log(JSON.stringify(props, null, 2));
}

export function trackLinkClick(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "LINK"),
		...LINK_FIELDS(src),
		...statefulProps()
	};

	let type;

	// "links" can also be "navigation"
	if (props["LINK → href"]?.startsWith('#')) {
		mp.track('navigation click', props);
		type = `NAVIGATION`;
	}

	else if (props["LINK → href"]?.includes(this.host)) {
		mp.track('navigation click', props);
		type = `NAVIGATION`;
	}

	else if (!props["LINK → href"]) {
		mp.track('navigation click', props);
		type = `NAVIGATION`;
	}

	else if (props["LINK → href"]?.startsWith('javascript')) {
		mp.track('navigation click', props);
		type = `NAVIGATION`;
	}

	else {
		mp.track('link click', props);
		type = `LINK`;
	}

	if (opts.logProps) console.log(`${type} CLICK`); console.log(JSON.stringify(props, null, 2));
}

export function trackFormSubmit(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "FORM"),
		...FORM_FIELDS(src),
		...statefulProps()
	};
	mp.track('form submit', props);
	if (opts.logProps) console.log("FORM SUBMIT"); console.log(JSON.stringify(props, null, 2));
}

export function trackDropDownChange(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "OPTION"),
		...DROPDOWN_FIELDS(src),
		...statefulProps()
	};
	mp.track('user selection', props);
	if (opts.logProps) console.log('USER SELECTION'); console.log(JSON.stringify(props, null, 2));
}

export function trackInputChange(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "CONTENT"),
		...INPUT_FIELDS(src),
		...statefulProps()
	};
	mp.track('user entered text', props);
	if (opts.logProps) console.log('USER ENTERED CONTENT'); console.log(JSON.stringify(props, null, 2));
}

export function trackAnyClick(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...STANDARD_FIELDS(src),
		...ANY_TAG_FIELDS(src),
		...statefulProps()
	};
	mp.track('page click', props);
	if (opts.logProps) console.log('PAGE CLICK'); console.log(JSON.stringify(props, null, 2));
}


/*
----------------
WINDOW BEHAVIOR
----------------
*/

//default: off
export function trackWindowStuff(mp, opts) {

	//resize events happy in fast succession; we wait 3 sec before sending a single resize event
	window.addEventListener('resize', (resizeEv) => {
		window.clearTimeout(ezTrack.resizeTimer);
		ezTrack.resizeTimer = window.setTimeout(() => {
			const props = {
				"PAGE → height": window.innerHeight,
				"PAGE → width": window.innerWidth,
				...statefulProps()
			};
			mp.track('page resize', props);
		}, 3000);

	}, LISTENER_OPTIONS);

	window.addEventListener('beforeprint', (printEv) => {
		try {
			const props = {
				...statefulProps()
			};
			mp.track('print', props);
		}
		catch (e) {
			if (opts.debug) console.log(e);
		}
	}, LISTENER_OPTIONS);
}

//default: off
export function trackErrors(mp, opts) {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window#events
	window.addEventListener('error', (errEv) => {
		try {
			const props = {
				"ERROR → type": errEv.type,
				"ERROR → message": errEv.message,
				...statefulProps()
			};
			mp.track('page error', props);
		}
		catch (e) {
			if (opts.debug) console.log(e);
		}
	}, LISTENER_OPTIONS);

}

//default: off 🚨 guard against sensitive clipboards 🚨
export function trackClipboard(mp, opts) {

	window.addEventListener('cut', (clipEv) => {
		try {
			const props = {
				...statefulProps(),
				...STANDARD_FIELDS(clipEv.target),
				...ANY_TAG_FIELDS(clipEv.target, true)
			};
			mp.track('cut', props);
			if (opts.logProps) console.log(JSON.stringify(props, null, 2));
		}
		catch (e) {
			if (opts.debug) console.log(e);
		}
	}, LISTENER_OPTIONS);

	window.addEventListener('copy', (clipEv) => {
		try {
			const props = {
				...statefulProps(),
				...STANDARD_FIELDS(clipEv.target),
				...ANY_TAG_FIELDS(clipEv.target, true)
			};
			mp.track('copy', props);
			if (opts.logProps) console.log(JSON.stringify(props, null, 2));
		}
		catch (e) {
			if (opts.debug) console.log(e);
		}
	}, LISTENER_OPTIONS);

	window.addEventListener('paste', (clipEv) => {
		try {
			const props = {
				...statefulProps(),
				...STANDARD_FIELDS(clipEv.target),
				...ANY_TAG_FIELDS(clipEv.target, true)
			};
			mp.track('paste', props);
			if (opts.logProps) console.log(JSON.stringify(props, null, 2));
		}
		catch (e) {
			if (opts.debug) console.log(e);
		}
	}, LISTENER_OPTIONS);

}

/*
--------
PROFILES
--------
*/

//default: on
export function createUserProfiles(mp, opts) {
	try {
		mp.identify(mp.get_distinct_id());
		mp.people.set({
			"USER → last page viewed": window.location.href,
			"USER → language": window.navigator.language
		});
		mp.people.increment("total # pages");
		mp.people.set_once({ "$name": "anonymous", "$Created": new Date().toISOString() });
	}
	catch (e) {
		if (opts.debug) console.log(e);
	}
}

/*
-----
VIDEO
-----
*/


//default: off
export function trackYoutubeVideos(mp, opts) {
	// enable youtube iframe API; callback to onYouTubeIframeAPIReady
	const tag = document.createElement('script');
	tag.id = 'mixpanel-iframe-tracker';
	tag.src = 'https://www.youtube.com/iframe_api';
	const firstScriptTag = document.getElementsByTagName('script')[0] || document.getElementsByTagName('body')[0].children[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	const videos = uniqueNodes(this.query(YOUTUBE_SELECTOR)).filter(frame => frame.src.includes('youtube.com/embed'));

	for (video of videos) {
		this.domElementsTracked.push(video);
		if (!video.id) {
			video.id = new URL(video.src).pathname.replace("/embed/", "");
		}

		// note: enabling the iframe API triggers a redirect on the video, causing it to "flash"
		if (!video.src.includes('enablejsapi')) {
			const newSRC = new URL(video.src);
			newSRC.searchParams.delete('enablejsapi');
			newSRC.searchParams.append('enablejsapi', 1);
			video.src = newSRC.toString();
		}
	}

	// this called by youtube's iframe api and needs to be named as such
	window.onYouTubeIframeAPIReady = function () {
		const videos = ezTrack.query(YOUTUBE_SELECTOR).filter(frame => frame.src.includes('youtube.com/embed'));
		for (const video of videos) {
			bindTrackingToVideo(video.id);
		}
	};

	function bindTrackingToVideo(videoId) {
		const player = new YT.Player(videoId, {
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	function getVideoInfo(player) {
		const videoInfo = player.getVideoData();
		const videoProps = {
			'VIDEO → quality': player.getPlaybackQuality(),
			'VIDEO → length (sec)': player.getDuration(),
			'VIDEO → ellapsed (sec)': player.getCurrentTime(),
			'VIDEO → url': player.getVideoUrl(),
			'VIDEO → title': videoInfo.title,
			'VIDEO → id': videoInfo.video_id,
			'VIDEO → author': videoInfo.author,
			"VIDEO → fullscreen": !(document.fullscreenElement === null)
		};
		return videoProps;
	}

	function onPlayerReady(event) {
		const videoInfo = getVideoInfo(event.target);
		mp.track('youtube player load', videoInfo);
		mp.time_event('youtube video started');
	}

	function onPlayerStateChange(event) {
		trackPlayerChanges(event.data, event.target);
	}

	//player states: https://developers.google.com/youtube/iframe_api_reference#Playback_status
	function trackPlayerChanges(playerStatus, player) {
		const videoInfo = getVideoInfo(player);

		switch (playerStatus) {
			case -1:
				//mp.track('youtube video unstarted but ready', videoInfo);   
				break;
			case 0:
				mp.track('youtube video finish', { ...videoInfo, ...statefulProps() });
				break;
			case 1:
				mp.track('youtube video play', { ...videoInfo, ...statefulProps() });
				mp.time_event('youtube video finish');
				break;
			case 2:
				mp.track('youtube video pause', { ...videoInfo, ...statefulProps() });
				break;
			case 3:
				// mp.track('youtube video buffer', videoInfo);
				break;
			case 5:
				// mp.track('youtube video queued', videoInfo);
				break;
			default:
				break;
		}
	}
}


/*
-------
HELPERS
-------
*/

export function figureOutWhatWasClicked(elem, ev, mp, opts) {
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
	
	// no sensitive fields
	if (elem.matches(BLACKLIST_ELEMENTS)) {
		return false;
	}

	if (elem.matches(BUTTON_SELECTORS)) {
		this.spaPipe('button', ev, mp, opts);
		return true;
	}
	else if (elem.matches(LINK_SELECTORS)) {
		this.spaPipe('link', ev, mp, opts);
		return true;
	}

	else if (elem.matches(FORM_SELECTORS)) {
		elem.addEventListener('submit', (submitEvent) => {
			this.spaPipe('form', submitEvent, mp, opts);
		}, { once: true, ...LISTENER_OPTIONS });
		return true;
	}
	else if (elem.matches(DROPDOWN_SELECTOR)) {
		elem.addEventListener('change', (changeEvent) => {
			this.spaPipe('select', changeEvent, mp, opts);
		}, { once: true, ...LISTENER_OPTIONS });
		return true;
	}
	else if (elem.matches(INPUT_SELECTOR)) {
		elem.addEventListener('change', (changeEvent) => {
			this.spaPipe('input', changeEvent, mp, opts);
		}, { once: true, ...LISTENER_OPTIONS });
		return true;

	}

	//check parents
	const possibleMatches = [BUTTON_SELECTORS, LINK_SELECTORS, FORM_SELECTORS, DROPDOWN_SELECTOR, INPUT_SELECTOR];
	const matchingParents = getAllParents(elem).filter((node) => {
		let matched = possibleMatches.map((matchSelector) => {
			return node.matches(matchSelector);
		});

		return matched.some(bool => bool);

	});

	if (matchingParents.length > 0) {
		figureOutWhatWasClicked.call(ezTrack, matchingParents[0], ev, mp, opts);
		return true;
	}

	const mostSpecificNode = findMostSpecificRecursive(elem);
	if (elem.matches(ALL_SELECTOR) && mostSpecificNode === elem) {
		this.spaPipe('all', ev, mp, opts);
		return true;
	}

	else {
		return false; //click was not tracked
	}

}

export function findMostSpecificRecursive(node) {
	const numChildren = node.childElementCount;
	if (numChildren !== 0) {
		let nextNode = node.firstElementChild;
		if (!nextNode) nextNode = node.nextElementSibling;
		if (!nextNode) nextNode = node.priorElementSibling;
		if (!nextNode) return node;
		else {
			return findMostSpecificRecursive(nextNode);
		}
	}

	else {
		return node;
	}
}

export function getAllParents(elem) {

	// Set up a parent array
	var parents = [];

	// Push each parent element to the array
	for (; elem && elem !== document.body; elem = elem.parentNode) {
		parents.push(elem);
	}

	// Return our parent array
	return parents;

};

export function uniqueNodes(arrayOfNodes) {
	return [...new Set(arrayOfNodes)];
}

//put it in global namespace 🤠
window.mpEZTrack = ezTrack;