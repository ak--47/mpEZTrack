import mixpanel from 'mixpanel-browser';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import {
	SUPER_PROPS,
	STANDARD_FIELDS,
	LINK_SELECTORS,
	LINK_FIELDS,
	BUTTON_SELECTORS,
	BUTTON_FIELDS,
	FORM_SELECTORS,
	FORM_FIELDS,
	ALL_SELECTOR,
	ANY_TAG_FIELDS,
	YOUTUBE_SELECTOR,
	LISTENER_OPTIONS
} from './attributes';

export const ezTrack = {	
	init: bootStrapModule,
	loadTime: Date.now(),
	numActions: 0,
	domElements: [],
	bind: bindTrackers,
	query: querySelectorAllDeep, //this guy can pierce the shadow dom
	pageView: trackPageViews,
	pageExit: trackPageExits,
	buttons: trackButtonClicks,
	links: trackLinkClicks,
	forms: trackFormSubmits,
	clicks: trackAllClicks,
	youtube: trackYoutubeVideos,
	profiles: createUserProfiles,
	forceDebug: () => { mixpanel.ez.set_config({ debug: true }); }, //currently undocumented

	//todo?
	window: detectGlobalEvents,
	spa: beSpaAware,


	// DEFAULTS!
	defaultOpts: function getDefaultOptions() {
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

			//default off
			clicks: false,
			youtube: false,

			//wip
			spa: 'none',
			window: false,
			select: false, //select tags, input radios, datalists, and optgroups: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
			typing: false, //textareas + inputs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea



		};
	}

};


export function bootStrapModule(token = ``, userSuppliedOptions = {}, forceTrue = false) {
	// validate token as 32 char string
	if (!token || token.length !== 32) {
		console.error(`EZTrack: Bad Token!\n\ngot: "${token}"\nexpected 32 char string\n\ndouble check your mixpanel project token and try again!\nhttps://developer.mixpanel.com/reference/project-token`);
		throw new Error(`BAD TOKEN! TRY AGAIN`);
	}

	//gather options
	const defaultOpts = this.defaultOpts();
	const opts = { ...defaultOpts, ...userSuppliedOptions };
	if (forceTrue) {
		for (let key in opts) {
			if (typeof opts[key] === 'boolean') opts[key] = true;
			if (typeof opts[key] === 'number') opts[key] = 0;
		}
	}
	try {
		//setup mp
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
					mp.register(SUPER_PROPS, { persistent: false });
				}
				this.bind(mp, opts);
			}
		}, "ez");

		//expose mixpanel globally
		if (opts.extend) window.mixpanel = mixpanel;
	}

	catch (e) {
		if (opts.debug)
			console.log(e);
	}

}

export function bindTrackers(mp, opts) {
	try {
		if (opts.pageView) this.pageView(mp, opts);
		if (opts.pageExit) this.pageExit(mp, opts);
		if (opts.links) this.links(mp, opts);
		if (opts.buttons) this.buttons(mp, opts);
		if (opts.forms) this.forms(mp, opts);
		if (opts.clicks) this.clicks(mp, opts);
		if (opts.profiles) this.profiles(mp, opts);
		if (opts.youtube) this.youtube(mp, opts);
		if (opts.window) this.window(mp, opts);
		if (opts.spa) this.spa(opts.spa, mp, opts);
	}
	catch (e) {
		if (opts.debug)
			console.log(e);
	}

}

export function statefulProps() {
	ezTrack.numActions += 1
	return {
		"SESSION → time on page (sec)" : (Date.now() - ezTrack.loadTime)/1000,
		"SESSION → # actions" : ezTrack.numActions,
		"PAGE → scroll (%)" : Number((((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100) || 0).toFixed(2))
	}
}

export function trackPageViews(mp, opts) {
	mp.track('page enter', {...statefulProps()});
	// if (opts.pageExit) mp.time_event('page exit');
}

export function trackPageExits(mp, opts) {
	window.addEventListener('beforeunload', () => {		
		mp.track('page exit', { ...statefulProps() }, { transport: 'sendBeacon', send_immediately: true });
	});
}

export function trackButtonClicks(mp, opts) {
	const buttons = this.query(BUTTON_SELECTORS);
	for (const button of buttons) {
		this.domElements.push(button);
		button.addEventListener('click', (e) => {
			try {
				mp.track('button click', { ...STANDARD_FIELDS(e), ...BUTTON_FIELDS(e), ...statefulProps() });
			}
			catch (e) {
				if (opts.debug)
					console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackLinkClicks(mp, opts) {
	const links = this.query(LINK_SELECTORS);
	for (const link of links) {
		this.domElements.push(link);
		link.addEventListener('click', (e) => {
			try {
				mp.track('link click', { ...STANDARD_FIELDS(e), ...LINK_FIELDS(e), ...statefulProps() });
			}
			catch (e) {
				if (opts.debug)
					console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackFormSubmits(mp, opts) {
	const forms = this.query(FORM_SELECTORS);
	for (const form of forms) {
		this.domElements.push(form);
		form.addEventListener('submit', (e) => {
			try {
				mp.track('form submit', { ...STANDARD_FIELDS(e), ...FORM_FIELDS(e), ...statefulProps() });
			}
			catch (e) {
				if (opts.debug)
					console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackAllClicks(mp, opts) {
	let allThings = this.query(ALL_SELECTOR)
		.filter(node => node.children.length === 0)
		.filter(node => !this.domElements.some(el => el === node))
		.filter(node => !this.domElements.some(el => el.contains(node)))

	for (const thing of allThings) {
		this.domElements.push(thing);
		thing.addEventListener('click', (e) => {
			try {
				mp.track('page click', { ...STANDARD_FIELDS(e), ...ANY_TAG_FIELDS(e), ...statefulProps() });
			}
			catch (e) {
				if (opts.debug)
					console.log(e);
			}
		}, LISTENER_OPTIONS);
	}
}

export function trackYoutubeVideos(mp, opts) {
	const tag = document.createElement('script');
	tag.id = 'mixpanel-iframe-tracker';
	tag.src = 'https://www.youtube.com/iframe_api';
	const firstScriptTag = document.getElementsByTagName('script')[0] || document.getElementsByTagName('body')[0].children[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//todo... how to bind THIS?
	const videos = this.query(YOUTUBE_SELECTOR).filter(frame => frame.src.includes('youtube.com/embed'));

	// note: enabling the iframe API triggers a redirect on the video, causing it to "flash"
	for (video of videos) {
		this.domElements.push(video);
		if (!video.src.includes('enablejsapi')) {
			const newSRC = new URL(video.src);
			newSRC.searchParams.delete('enablejsapi');
			newSRC.searchParams.append('enablejsapi', 1);
			video.src = newSRC.toString();

		}

		if (!video.id) {
			video.id = new URL(video.src).pathname.replace("/embed/", "");
		}
	}

	// called by youtube's iframe api
	//todo... how to bind THIS ?
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
				mp.track('youtube video finish', {...videoInfo, ...statefulProps()});
				break;

			case 1:
				mp.track('youtube video play', {...videoInfo, ...statefulProps()});
				mp.time_event('youtube video finish');
				break;

			case 2:
				mp.track('youtube video pause', {...videoInfo, ...statefulProps()});
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

export function createUserProfiles(mp, opts) {
	try {
		mp.identify(mp.get_distinct_id());
		mp.people.set({ "last page viewed": window.location.href, "language": window.navigator.language });
		mp.people.set_once({ "$name": "anonymous" });
		mp.people.increment("total # pages");
		mp.people.set_once({ "$Created": new Date().toISOString() });
	}
	catch (e) {
		if (opts.debug)
			console.log(e);
	}
}

//TODOs


// https://developer.mozilla.org/en-US/docs/Web/API/Window#events
export function detectGlobalEvents(mp, opts) {

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

//put it in global namespace 🤠
window.mpEZTrack = ezTrack;