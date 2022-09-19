import mixpanel from 'mixpanel-browser';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import {
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


	// stateful props
	loadTimeUTC: Date.now(),
	numActions: 0,
	isFirstVisit: true,
	priorVisit: firstVisitChecker,
	debug: () => { mixpanel.ez.set_config({ debug: true }); },

	// dom stuff
	domElementsTracked: [],
	bind: bindTrackers,
	query: querySelectorAllDeep, //this guy can pierce the shadow dom
	spa: beSpaAware, // todo???

	//elements + tracking
	pageView: trackPageViews,
	pageExit: trackPageExits,
	buttons: trackButtonClicks,
	links: trackLinkClicks,
	forms: trackFormSubmits,
	selectors: trackDropDowns,
	inputs: trackUserInput,
	clicks: trackClicks,
	youtube: trackYoutubeVideos,

	// meta
	window: trackWindowStuff,
	clipboard: trackClipboard,
	profiles: createUserProfiles,

	// DEFAULTS!
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

	// gather options
	const defaultOpts = this.defaultOpts();
	const opts = { ...defaultOpts, ...userSuppliedOptions };
	if (forceTrue) {
		for (let key in opts) {
			if (typeof opts[key] === 'boolean') opts[key] = true;
			if (typeof opts[key] === 'number') opts[key] = 0;
		}
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
				if (opts.superProps) {
					mp.register({
						...SUPER_PROPS,
						...this.priorVisit(token) //check prior visits
					}, { persistent: false });

				}

				//add tracking
				this.bind(mp, opts);
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

		//wip
		logProps: false, //undocumented, for ez debugging
		spa: 'none'

	};
}

export function bindTrackers(mp, opts) {
	try {
		if (opts.pageView) this.pageView(mp, opts);
		if (opts.pageExit) this.pageExit(mp, opts);
		if (opts.buttons) this.buttons(mp, opts);
		if (opts.forms) this.forms(mp, opts);
		if (opts.selectors) this.selectors(mp, opts);
		if (opts.inputs) this.inputs(mp, opts);
		if (opts.links) this.links(mp, opts);
		if (opts.profiles) this.profiles(mp, opts);
		if (opts.youtube) this.youtube(mp, opts);
		if (opts.window) this.window(mp, opts);
		if (opts.clipboard) this.clipboard(mp, opts);
		if (opts.spa) this.spa(opts.spa, mp, opts);
		//this should always be last
		if (opts.clicks) this.clicks(mp, opts);
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

export function firstVisitChecker(token) {
	const isFirstVisit = localStorage.getItem(`MPEZTrack_First_Visit_${token}`);

	if (isFirstVisit === null) {
		localStorage.setItem(`MPEZTrack_First_Visit_${token}`, false);
		this.isFirstVisit = false; //side-effect
		return { "SESSION → is first visit?": true };
	}

	else {
		return { "SESSION → is first visit?": false };
	}
}

/*
-------------
HTML ELEMENTS
-------------
*/

// QQ: will the pagehide pageshow PageTransition Events be more reliable?
export function trackPageViews(mp, opts) {
	mp.track('page enter', { ...statefulProps() });
	// if (opts.pageExit) mp.time_event('page exit');
}

export function trackPageExits(mp, opts) {
	window.addEventListener('beforeunload', () => {
		mp.track('page exit', { ...statefulProps() }, { transport: 'sendBeacon', send_immediately: true });
	});
}

export function trackButtonClicks(mp, opts) {
	const buttons = uniqueNodes(this.query(BUTTON_SELECTORS))
		.filter(node => node.tagName !== 'LABEL') //not a label
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const button of buttons) {
		this.domElementsTracked.push(button);
		button.addEventListener('click', (ev) => {
			try {
				const props = {
					...STANDARD_FIELDS(ev.target, "BUTTON"),
					...BUTTON_FIELDS(ev.target),
					...statefulProps()
				};
				mp.track('button click', props);
				if (opts.logProps) console.log(JSON.stringify(props, null, 2));
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackLinkClicks(mp, opts) {
	const links = uniqueNodes(this.query(LINK_SELECTORS))
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const link of links) {
		this.domElementsTracked.push(link);
		link.addEventListener('click', (ev) => {
			try {
				const props = {
					...STANDARD_FIELDS(ev.target, "LINK"),
					...LINK_FIELDS(ev.target),
					...statefulProps()
				};
				mp.track('link click', props);
				if (opts.logProps) console.log(JSON.stringify(props, null, 2));
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackFormSubmits(mp, opts) {
	const forms = uniqueNodes(this.query(FORM_SELECTORS));
	for (const form of forms) {
		this.domElementsTracked.push(form);
		form.addEventListener('form submit', (ev) => {
			try {
				const props = {
					...STANDARD_FIELDS(ev.target, "FORM"),
					...FORM_FIELDS(ev.target),
					...statefulProps()
				};
				mp.track('form submit', props);
				if (opts.logProps) console.log(JSON.stringify(props, null, 2));
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackDropDowns(mp, opts) {
	let allDropdowns = uniqueNodes(this.query(DROPDOWN_SELECTOR))
		.filter(node => node.tagName !== 'LABEL') //not a label
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const dropdown of allDropdowns) {
		this.domElementsTracked.push(dropdown);
		dropdown.addEventListener('change', (ev) => {
			try {
				const props = {
					...STANDARD_FIELDS(ev.target, "OPTION"),
					...DROPDOWN_FIELDS(ev.target),
					...statefulProps()
				};
				mp.track('user selection', props);
				if (opts.logProps) console.log(JSON.stringify(props, null, 2));
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackUserInput(mp, opts) {
	let inputElements = uniqueNodes(this.query(INPUT_SELECTOR))
		.filter(node => node.tagName !== 'LABEL') //not a label
		.filter(node => !this.domElementsTracked.some(el => el === node)); //not already tracked

	for (const input of inputElements) {
		this.domElementsTracked.push(input);
		input.addEventListener('change', (ev) => {
			try {
				const props = {
					...STANDARD_FIELDS(ev.target, "CONTENT"),
					...INPUT_FIELDS(ev.target),
					...statefulProps()
				};
				mp.track('user entered text', props);
				if (opts.logProps) console.log(JSON.stringify(props, null, 2));
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

// 🚨 guard against password fields 🚨
export function trackClicks(mp, opts) {
	let allThings = uniqueNodes(this.query(ALL_SELECTOR))
		.filter(node => node.childElementCount === 0) //most specific
		.filter(node => !this.domElementsTracked.some(el => el === node)) //not already tracked
		.filter(node => !this.domElementsTracked.some(trackedEl => trackedEl.contains(node))) //not a child of already tracked
		.filter(node => node.tagName !== 'LABEL') //not a label
		.filter(node => (node.tagName === 'INPUT') ? (node.type === "password" || node.type === "hidden" ? false : true) : true); //not a password or hidden input

	for (const thing of allThings) {
		this.domElementsTracked.push(thing);
		thing.addEventListener('click', (ev) => {
			try {
				const props = {
					...STANDARD_FIELDS(ev.target),
					...ANY_TAG_FIELDS(ev.target),
					...statefulProps()
				};
				mp.track('page click', props);
				if (opts.logProps) console.log(JSON.stringify(props, null, 2));
			}
			catch (e) {
				if (opts.debug) console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

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
-----------------
BROWSER BEHAVIORS
-----------------
*/

export function trackWindowStuff(mp, opts) {
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

// 🚨 guard against clipboard passwords 🚨
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
	});

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
	});

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
	});

}

/*
-------
HELPERS
-------
*/

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

export function beSpaAware(typeOfSpa = 'none', mp, opts) {
	switch (typeOfSpa.toLowerCase()) {
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

export function uniqueNodes(arrayOfNodes) {
	return [...new Set(arrayOfNodes)];
}

//put it in global namespace 🤠
window.mpEZTrack = ezTrack;