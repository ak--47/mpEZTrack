import mixpanel from "mixpanel-browser";
import { querySelectorAllDeep } from "query-selector-shadow-dom";
import {
	BLACKLIST_ELEMENTS,
	PAGE_PROPS,
	DEVICE_PROPS,
	STANDARD_FIELDS,
	LINK_SELECTORS,
	LINK_FIELDS,
	linkOrNav,
	BUTTON_SELECTORS,
	BUTTON_FIELDS,
	FORM_SELECTORS,
	FORM_FIELDS,
	DROPDOWN_SELECTOR,
	DROPDOWN_FIELDS,
	INPUT_SELECTOR,
	INPUT_FIELDS,
	ALL_SELECTOR,
	ANY_TAG_FIELDS,
	VIDEO_SELECTOR,
	VIDEO_FIELDS,
	YOUTUBE_SELECTOR,
	LISTENER_OPTIONS
} from "./attributes";

export const ezTrack = {
	// entry
	init: entryPoint,

	// stateful stuff
	token: "",
	tabId: null,
	tabTrack: generateTabId,
	loadTimeUTC: Date.now(),
	numActions: 0,
	isFirstVisit: true,
	priorVisit: firstVisitChecker,
	hasVisibilityChanged: false,
	superProps: {},
	getProps: getSuperProperties,
	clearQueue: clearExistingMixpanelQueue,
	getEZConfig: getEZTrackConfig,

	debug: () => {
		mixpanel.ez.set_config({ debug: true });
	},
	mpDefaults: [
		"$os",
		"$browser",
		"$referrer",
		"$referring_domain",
		"$current_url",
		"$browser_version",
		"$screen_height",
		"$screen_width",
		"$initial_referrer",
		"$initial_referring_domain"
	],

	// dom stuff
	trackedElements: [],
	blackListedElements: [],
	host: document.location.host,
	bind: bindTrackers,
	query: querySelectorAllDeep, //this guy can pierce the shadow dom

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
	videos: listenForVideo,
	linkOrNav,

	// tracking stuff
	buttonTrack: trackButtonClick,
	linkTrack: trackLinkClick,
	formTrack: trackFormSubmit,
	selectTrack: trackDropDownChange,
	inputTrack: trackInputChange,
	videoTrack: trackVideo,
	clickTrack: trackAnyClick,

	// third party stuff
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
		console.error(
			`EZTrack: Bad Token!\n\ngot: "${token}"\nexpected 32 char string\n\ndouble check your mixpanel project token and try again!\nhttps://developer.mixpanel.com/reference/project-token`
		);
		throw new Error(`BAD TOKEN! TRY AGAIN`);
	}
	this.token = token;

	// gather options
	const defaultOpts = this.defaultOpts();
	const opts = { ...defaultOpts, ...userSuppliedOptions };

	// overloading init()
	if (forceTrue) {
		for (let key in opts) {
			if (typeof opts[key] === "boolean") opts[key] = true;
			if (typeof opts[key] === "number") opts[key] = 0;
		}
		if (forceTrue === "nodebug") opts.debug = false;
	}

	this.opts = Object.freeze(opts);

	//don't send 'page lost focus' events if they are in the queue from a prior visit
	if (opts.window) this.clearQueue(token, opts);

	// do mixpanel
	try {
		mixpanel.init(
			token,
			{
				...this.opts,
				debug: opts.debug,
				cross_subdomain_cookie: true,
				persistence: opts.persistence,
				cookie_domain: opts.cookie_domain,
				ip: opts.location,
				ignore_dnt: true,
				batch_flush_interval_ms: opts.refresh,
				property_blacklist: this.mpDefaults,
				loaded: mp => {
					//props on every event
					try {
						const superProps = this.getProps(token, opts, mixpanel);
						if (opts.debug) this.superProps = superProps;
						mp.register(superProps, { persistent: false });
					} catch (e) {
						if (opts.debug) {
							console.error("mpEZTrack failed to setup super properties!");
							console.log(e);
						}
					}

					try {
						this.blackListedElements = [...this.query(BLACKLIST_ELEMENTS)];
					} catch (e) {
						if (opts.debug) {
							console.error("mpEZTrack failed bind to query for sensitive fields!");
							console.log(e);
						}
					}

					try {
						this.bind(mp, opts);
					} catch (e) {
						if (opts.debug) {
							console.error("mpEZTrack failed bind to the DOM!");
							console.log(e);
						}
					}
				}
			},
			"ez"
		);

		//expose mixpanel globally; let consumers know it's ready
		if (opts.extend) {
			window.mixpanel = mixpanel;

			try {
				const loadedEvent = new Event("mpEZTrackLoaded");
				window.dispatchEvent(loadedEvent);
			} catch (e) {
				if (opts.debug) {
					console.error("mpEZTrack failed to dispatch loaded event!");
					console.log(e);
				}
			}
		}
	} catch (e) {
		if (opts.debug) console.log(e);
	}
}

export function getDefaultOptions(opts = {}) {
	const defaults = {
		//meta
		debug: false,
		extend: false,
		refresh: 5000,
		location: true,
		persistence: "localStorage",
		cookie_domain: "",

		//default on
		deviceProps: true,
		pageView: true,
		pageExit: true,
		links: true,
		buttons: true,
		forms: true,
		profiles: true,
		selectors: true,
		videos: true,
		window: false,
		spa: true,

		//default off
		inputs: false,
		clicks: false,
		youtube: false,

		clipboard: false,
		firstPage: false,
		error: false,
		tabs: false,

		//undocumented, for ez debugging
		logProps: false
	};


	//backwards compatibility
	if (opts?.region?.toLowerCase() === 'eu') defaults.api_host = "https://api-eu.mixpanel.com";
	if (opts?.region?.toLowerCase() === 'us') defaults.api_host = "https://api-js.mixpanel.com";

	return defaults;
}

export function getSuperProperties(token = this.token, opts = this.opts, mixpanelClass) {
	let result = PAGE_PROPS;
	try {
		if (opts.deviceProps) result = { ...DEVICE_PROPS(mixpanelClass), ...result };
	} catch (e) { }
	try {
		if (opts.firstPage) result = { ...this.priorVisit(token, opts), ...result };
	} catch (e) { }
	try {
		if (opts.tabs) result = { ...this.tabTrack(token), ...result };
	} catch (e) { }
	return result;
}

export function bindTrackers(mp, opts) {
	try {
		//bound on page load
		if (opts.pageView) this.pageView(mp, opts);
		if (opts.pageExit) this.pageExit(mp, opts);
		if (opts.window) this.window(mp, opts);
		if (opts.error) this.error(mp, opts);
		if (opts.clipboard) this.clipboard(mp, opts);
		if (opts.profiles) this.profiles(mp, opts);

		//dom elements: bound on page load
		if (opts.buttons) this.buttons(mp, opts);
		if (opts.forms) this.forms(mp, opts);
		if (opts.selectors) this.selectors(mp, opts);
		if (opts.inputs) this.inputs(mp, opts);
		if (opts.links) this.links(mp, opts);
		if (opts.videos) this.videos(mp, opts);
		if (opts.youtube) this.youtube(mp, opts);

		// //this should always be last as it is the most general form of tracking for non spas
		// if (opts.clicks) this.clicks(mp, opts);

		//catch clicks on elements that are constructed after page is loaded
		if (opts.spa) this.spa(mp, opts);
	} catch (e) {
		if (opts.debug) console.log(e);
	}
}

export function statefulProps(increment = true, includeTime = true, includeScroll = true) {
	if (increment) ezTrack.numActions += 1;

	//https://stackoverflow.com/a/8028584
	const scrollPercent =
		((document.documentElement.scrollTop + document.body.scrollTop) /
			(document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
		100 || 0;

	const stateful = {
		"PAGE → # actions": ezTrack.numActions
	};

	if (includeTime) stateful["SESSION → time on page (sec)"] = (Date.now() - ezTrack.loadTimeUTC) / 1000;
	if (includeScroll) stateful["PAGE → scroll (%)"] = Number(scrollPercent.toFixed(2));

	return stateful;
}

//default: off
export function firstVisitChecker(token = this.token, opts = this.opts, timeoutMins = 30) {
	if (opts.firstPage) {
		try {
			const firstVisitTime = localStorage.getItem(`MPEZTrack_First_Visit_${token}`);
			const timeout = 60000 * timeoutMins;

			if (firstVisitTime === null) {
				localStorage.setItem(`MPEZTrack_First_Page_${token}`, this.loadTimeUTC);
				return { "SESSION → first visit?": true };
			}

			// 30 minute timeout
			else if (this.loadTimeUTC - firstVisitTime <= timeout) {
				return { "SESSION → first visit?": true };
			} else {
				this.isFirstVisit = false;
				return { "SESSION → first visit?": false };
			}
		} catch (e) {
			if (opts.debug) console.log(e);
			return { "DEVICE → first visit?": "unknown" };
		}
	} else {
		return {};
	}
}

/*
-------------
ELEMENT LISTENERS
-------------
*/

//default: on
export function listenForButtonClicks(mp, opts) {
	const buttons = uniqueNodes(this.query(BUTTON_SELECTORS))
		.filter(node => !node.matches(BLACKLIST_ELEMENTS))
		.filter(node => !this.trackedElements.some(el => el === node))
		.filter(node => !this.blackListedElements.some(el => el === node));

	for (const button of buttons) {
		this.trackedElements.push(button);
		button.addEventListener(
			"click",
			ev => {
				try {
					this.buttonTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);
	}
}

//default: on
export function listenForLinkClicks(mp, opts) {
	const links = uniqueNodes(this.query(LINK_SELECTORS))
		.filter(node => !node.matches(BLACKLIST_ELEMENTS))
		.filter(node => !this.trackedElements.some(el => el === node))
		.filter(node => !this.blackListedElements.some(el => el === node));

	for (const link of links) {
		this.trackedElements.push(link);
		link.addEventListener(
			"click",
			ev => {
				try {
					this.linkTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);
	}
}

//default: on
export function listenForFormSubmits(mp, opts) {
	const forms = uniqueNodes(this.query(FORM_SELECTORS));
	for (const form of forms) {
		this.trackedElements.push(form);
		form.addEventListener(
			"submit",
			ev => {
				try {
					this.formTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);
	}
}

//default: on
export function listenForDropDownChanges(mp, opts) {
	let allDropdowns = uniqueNodes(this.query(DROPDOWN_SELECTOR))
		.filter(node => !node.matches(BLACKLIST_ELEMENTS))
		.filter(node => !this.trackedElements.some(el => el === node))
		.filter(node => !this.blackListedElements.some(el => el === node));

	for (const dropdown of allDropdowns) {
		this.trackedElements.push(dropdown);
		dropdown.addEventListener(
			"change",
			ev => {
				try {
					this.selectTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);
	}
}

//default: on
export function listenForVideo(mp, opts) {
	let allVideos = uniqueNodes(this.query(VIDEO_SELECTOR))
		.filter(node => !node.matches(BLACKLIST_ELEMENTS))
		.filter(node => !this.trackedElements.some(el => el === node))
		.filter(node => !this.blackListedElements.some(el => el === node));

	for (const video of allVideos) {
		this.trackedElements.push(video);
		video.addEventListener(
			"play",
			ev => {
				try {
					this.videoTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);

		video.addEventListener(
			"pause",
			ev => {
				try {
					this.videoTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);

		video.addEventListener(
			"ended",
			ev => {
				try {
					this.videoTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);

		// for 'watching' events - setInterval is a better implementation:
		// https://developer.mozilla.org/en-US/docs/Web/API/setInterval
		// video.addEventListener('timeupdate', (ev) => {
		// 	window.clearTimeout(ezTrack.videoTimer);
		// 	ezTrack.videoTimer = window.setTimeout(() => {
		// 		try {
		// 			this.videoTrack(ev, mp, opts);
		// 		}
		// 		catch (e) {
		// 			if (opts.debug) console.log(e);
		// 		}
		// 	}, 3000);

		// }, LISTENER_OPTIONS);
	}
}

//default: off
export function listenForUserInput(mp, opts) {
	let inputElements = uniqueNodes(this.query(INPUT_SELECTOR))
		.filter(node => !node.matches(BLACKLIST_ELEMENTS))
		.filter(node => !this.trackedElements.some(el => el === node))
		.filter(node => !this.blackListedElements.some(el => el === node));

	for (const input of inputElements) {
		this.trackedElements.push(input);
		input.addEventListener(
			"change",
			ev => {
				try {
					this.inputTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);
	}
}

//default: off  🚨 guard against sensitive fields 🚨
export function listenForAllClicks(mp, opts) {
	let allThings = uniqueNodes(
		this.query(ALL_SELECTOR)
			.filter(node => node.childElementCount === 0) //most specific
			.filter(node => !this.trackedElements.some(el => el === node)) //not already tracked
			.filter(node => !this.trackedElements.some(trackedEl => trackedEl.contains(node))) //not a child of already tracked
			.filter(node => !this.trackedElements.some(trackedEl => node.parentNode === trackedEl)) //immediate parent is not already tracked
			.filter(node => !node.matches(BLACKLIST_ELEMENTS)) //isn't classified as sensitive
			.filter(node => !this.blackListedElements.some(el => el === node))
	);

	for (const thing of allThings) {
		this.trackedElements.push(thing);
		thing.addEventListener(
			"click",
			ev => {
				try {
					this.clickTrack(ev, mp, opts);
				} catch (e) {
					if (opts.debug) console.log(e);
				}
			},
			LISTENER_OPTIONS
		);
	}
}

/*
----
SPAS
-----
*/

//default: on
export function singlePageAppTracking(mp, opts) {
	window.addEventListener(
		"click",
		ev => {
			try {
				if (this.trackedElements.includes(ev.target)) return false;
				if (this.blackListedElements.includes(ev.target)) return false;
				figureOutWhatWasClicked.call(ezTrack, ev.target, ev, mp, opts);
			} catch (e) {
				if (opts.debug) console.log(e);
			}

			// //bind any other trackers that don't depend on clicks
			// try {
			// 	if (opts.youtube) ezTrack.youtube(mp, opts);
			// }
			// catch (e) {
			// 	if (opts.debug) console.log(e);
			// }
		},
		LISTENER_OPTIONS
	);
}

export function figureOutWhatWasClicked(elem, ev, mp, opts) {
	//this is called recursively, so we need to ensure we're not already tracking it and it's not already blacklisted
	if (this.trackedElements.includes(elem)) return false;
	if (this.blackListedElements.includes(elem)) return false;

	// no sensitive fields
	if (elem.matches(BLACKLIST_ELEMENTS)) {
		return false;
	}

	if (elem.matches(BUTTON_SELECTORS)) {
		if (elem) {
			this.spaPipe("button", elem, mp, opts);
		} else {
			this.spaPipe("button", ev, mp, opts);
		}
		return true;
	} else if (elem.matches(LINK_SELECTORS)) {
		if (elem) {
			this.spaPipe("link", elem, mp, opts);
		} else {
			this.spaPipe("link", ev, mp, opts);
		}
		return true;
	} else if (elem.matches(FORM_SELECTORS)) {
		if (elem) {
			this.spaPipe("form", elem, mp, opts);
		} else {
			this.spaPipe("form", ev, mp, opts);
		}
		return true;
	} else if (elem.matches(DROPDOWN_SELECTOR)) {
		if (elem) {
			this.spaPipe("select", elem, mp, opts);
		} else {
			this.spaPipe("select", ev, mp, opts);
		}
		return true;
	} else if (elem.matches(INPUT_SELECTOR)) {
		if (elem) {
			this.spaPipe("input", elem, mp, opts);
		} else {
			this.spaPipe("input", ev, mp, opts);
		}
		return true;
	} else if (elem.matches(VIDEO_SELECTOR)) {
		if (elem) {
			this.spaPipe("video", elem, mp, opts);
		} else {
			this.spaPipe("video", ev, mp, opts);
		}
		return true;
	}

	//the node didn't match any selectors; check it's parents
	const possibleMatches = [BUTTON_SELECTORS, LINK_SELECTORS, FORM_SELECTORS, DROPDOWN_SELECTOR, INPUT_SELECTOR, VIDEO_SELECTOR];
	const matchingParents = getAllParents(elem).filter(node => {
		let matched = possibleMatches.map(matchSelector => {
			return node.matches(matchSelector);
		});

		return matched.some(bool => bool);
	});

	if (matchingParents.length > 0) {
		figureOutWhatWasClicked.call(ezTrack, matchingParents[0], ev, mp, opts);
		return true;
	}

	// guard against double tracking due to bubbling
	const mostSpecificNode = findMostSpecificRecursive(elem);
	if (elem.matches(ALL_SELECTOR) && mostSpecificNode === elem) {
		this.spaPipe("all", ev, mp, opts);
		return true;
	} else {
		return false; //click was not tracked
	}
}

export function spaPipeline(directive = "none", evOrElem, mp, opts) {
	//distinguish between event and element
	let entity;
	if (evOrElem instanceof Event) {
		entity = evOrElem.target;
	} else if (evOrElem instanceof HTMLElement) {
		entity = evOrElem;
	} else {
		if (opts.debug) console.log("spaPipeline: invalid element or event");
		return false;
	}

	const isAlreadyTracked = this.trackedElements.includes(evOrElem.target);
	if (!isAlreadyTracked) {
		if (opts.buttons && directive === "button") {
			this.trackedElements.push(evOrElem.target);
			this.buttonTrack(evOrElem, mp, opts);

			//for next click
			entity.addEventListener(
				"click",
				clickEv => {
					this.buttonTrack(clickEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
		} else if (opts.links && directive === "link") {
			this.trackedElements.push(entity);
			this.linkTrack(evOrElem, mp, opts);

			//for next click
			entity.addEventListener("click", clickEv => {
				this.linkTrack(clickEv, mp, opts);
			});
		} else if (opts.forms && directive === "form") {
			this.trackedElements.push(entity);
			entity.addEventListener(
				"submit",
				submitEv => {
					this.formTrack(submitEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
		} else if (opts.selectors && directive === "select") {
			this.trackedElements.push(entity);
			entity.addEventListener(
				"change",
				changeEv => {
					this.selectTrack(changeEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
		} else if (opts.inputs && directive === "input") {
			this.trackedElements.push(entity);
			entity.addEventListener(
				"change",
				changeEv => {
					this.inputTrack(changeEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
		} else if (opts.videos && directive === "video") {
			this.trackedElements.push(entity);
			entity.addEventListener(
				"play",
				videoEv => {
					this.videoTrack(videoEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
			entity.addEventListener(
				"pause",
				videoEv => {
					this.videoTrack(videoEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
			entity.addEventListener(
				"ended",
				videoEv => {
					this.videoTrack(videoEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
		}
		//this should always be last as it is the most general form of tracking
		else if (opts.clicks && directive === "all") {
			this.trackedElements.push(entity);
			this.clickTrack(evOrElem, mp, opts);

			//for next click
			entity.addEventListener(
				"click",
				clickEv => {
					this.clickTrack(clickEv, mp, opts);
				},
				LISTENER_OPTIONS
			);
		}
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
	} else {
		return node;
	}
}

export function getAllParents(elem) {
	const parents = [];

	//move up toward the body
	for (; elem && elem !== document.body; elem = elem.parentNode) {
		parents.push(elem);
	}

	return parents;
}

/*
---------
TRACKERS
--------
*/

//default: on
export function trackPageViews(mp, opts) {
	mp.track("page enter", { ...statefulProps(false, false, false) });
	if (opts.logProps) {
		console.log("PAGE ENTER");
		console.log(JSON.stringify(PAGE_PROPS, null, 2));
	}
}

//default: on
export function trackPageExits(mp, opts) {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#usage_notes
	// https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event#sending_end-of-session_analytics_on_transitioning_to_hidden
	window.addEventListener("beforeunload", () => {
		//page exit should be last event
		this.hasVisibilityChanged = null;
		mp.track("page exit", { ...statefulProps(false) }, { transport: "sendBeacon", send_immediately: true });
		if (opts.logProps) {
			console.log("PAGE EXIT");
			console.log(JSON.stringify({ ...statefulProps(false) }, null, 2));
		}
	});
}

export function trackButtonClick(evOrEl, mp, opts) {
	const src = evOrEl.currentTarget || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "BUTTON"),
		...BUTTON_FIELDS(src),
		...statefulProps()
	};

	mp.track("button click", props);
	if (opts.logProps) {
		console.log("BUTTON CLICK");
		console.log(JSON.stringify(props, null, 2));
	}
}

export function trackLinkClick(evOrEl, mp, opts) {
	const src = evOrEl.currentTarget || evOrEl;
	const linkType = linkOrNav.call(ezTrack, src);
	const props = {
		...STANDARD_FIELDS(src, linkType.label),
		...LINK_FIELDS(src, linkType.label),
		...statefulProps()
	};

	mp.track(`${linkType.eventName} click`, props);

	if (opts.logProps) {
		console.log(`${linkType.eventName.toUpperCase()} CLICK`);
		console.log(JSON.stringify(props, null, 2));
	}
}

export function trackFormSubmit(evOrEl, mp, opts) {
	const src = evOrEl.currentTarget || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "FORM"),
		...FORM_FIELDS(src),
		...statefulProps()
	};
	mp.track("form submit", props);
	if (opts.logProps) {
		console.log("FORM SUBMIT");
		console.log(JSON.stringify(props, null, 2));
	}
}

export function trackDropDownChange(evOrEl, mp, opts) {
	const src = evOrEl.currentTarget || evOrEl;
	const props = {
		...STANDARD_FIELDS(src, "OPTION"),
		...DROPDOWN_FIELDS(src),
		...statefulProps()
	};
	mp.track("user selection", props);
	if (opts.logProps) {
		console.log("USER SELECTION");
		console.log(JSON.stringify(props, null, 2));
	}
}

export function trackInputChange(evOrEl, mp, opts) {
	const src = evOrEl.currentTarget || evOrEl;
	const props = {
		...INPUT_FIELDS(src),
		...statefulProps(),
		...STANDARD_FIELDS(src, "CONTENT")
	};
	mp.track("user entered text", props);
	if (opts.logProps) {
		console.log("USER ENTERED CONTENT");
		console.log(JSON.stringify(props, null, 2));
	}
}

export function trackVideo(videoEvent, mp, opts) {
	const src = videoEvent.target;
	const props = {
		...STANDARD_FIELDS(src, "VIDEO"),
		...VIDEO_FIELDS(src),
		...statefulProps()
	};
	const action = videoEvent.type;
	mp.track(`video: ${action}`, props);
	if (opts.logProps) {
		console.log(`VIDEO ${action}`);
		console.log(JSON.stringify(props, null, 2));
	}
}

export function trackAnyClick(evOrEl, mp, opts) {
	const src = evOrEl.target || evOrEl;
	const props = {
		...ANY_TAG_FIELDS(src),
		...statefulProps(),
		...STANDARD_FIELDS(src)
	};
	mp.track("page click", props);
	if (opts.logProps) {
		console.log("PAGE CLICK");
		console.log(JSON.stringify(props, null, 2));
	}
}

/*
----------------
WINDOW BEHAVIOR
----------------
*/

//default: off
export function trackWindowStuff(mp, opts) {
	//resize events happen in fast succession; we wait 3 sec before sending a single resize event
	window.addEventListener(
		"resize",
		() => {
			window.clearTimeout(ezTrack.resizeTimer);
			ezTrack.resizeTimer = window.setTimeout(() => {
				const props = {
					"PAGE → height": window.innerHeight,
					"PAGE → width": window.innerWidth,
					...statefulProps(false)
				};
				mp.track("page resize", props);
			}, 3000);
		},
		LISTENER_OPTIONS
	);

	window.addEventListener(
		"beforeprint",
		() => {
			try {
				const props = {
					...statefulProps(false)
				};
				mp.track("print", props);
			} catch (e) {
				if (opts.debug) console.log(e);
			}
		},
		LISTENER_OPTIONS
	);

	window.addEventListener("visibilitychange", function () {
		const props = {
			...statefulProps(false)
		};
		if ((document.hidden || document.visibilityState === "hidden") && this.hasVisibilityChanged !== null) {
			mp.track("page lost focus", props);
			this.hasVisibilityChanged = true;
		} else {
			//only called if page has lost focus
			if (this.hasVisibilityChanged) mp.track("page regained focus", props);
		}
	});

	document.addEventListener("fullscreenchange", function () {
		const props = {
			...statefulProps(false)
		};
		if (document.fullscreenElement) {
			mp.track("page fullscreen: on", props);
		} else {
			mp.track("page fullscreen: off", props);
		}
	});
}

//default: off
export function trackErrors(mp, opts) {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window#events
	window.addEventListener(
		"error",
		errEv => {
			try {
				const props = {
					"ERROR → type": errEv.type,
					"ERROR → message": errEv.message,
					...statefulProps(false)
				};
				mp.track("page error", props);
			} catch (e) {
				if (opts.debug) console.log(e);
			}
		},
		LISTENER_OPTIONS
	);
}

//default: off 🚨 guard against sensitive clipboards 🚨
export function trackClipboard(mp, opts) {
	window.addEventListener(
		"cut",
		clipEv => {
			try {
				const props = {
					...statefulProps(false),
					...STANDARD_FIELDS(clipEv.target),
					...ANY_TAG_FIELDS(clipEv.target, true)
				};
				mp.track("cut", props);
				if (opts.logProps) {
					console.log("CUT");
					console.log(JSON.stringify(props, null, 2));
				}
			} catch (e) {
				if (opts.debug) console.log(e);
			}
		},
		LISTENER_OPTIONS
	);

	window.addEventListener(
		"copy",
		clipEv => {
			try {
				const props = {
					...statefulProps(false),
					...STANDARD_FIELDS(clipEv.target),
					...ANY_TAG_FIELDS(clipEv.target, true)
				};
				mp.track("copy", props);
				if (opts.logProps) {
					console.log("COPY");
					console.log(JSON.stringify(props, null, 2));
				}
			} catch (e) {
				if (opts.debug) console.log(e);
			}
		},
		LISTENER_OPTIONS
	);

	window.addEventListener(
		"paste",
		clipEv => {
			try {
				const props = {
					...statefulProps(false),
					...STANDARD_FIELDS(clipEv.target),
					...ANY_TAG_FIELDS(clipEv.target, true)
				};
				mp.track("paste", props);
				if (opts.logProps) {
					console.log("PASTE");
					console.log(JSON.stringify(props, null, 2));
				}
			} catch (e) {
				if (opts.debug) console.log(e);
			}
		},
		LISTENER_OPTIONS
	);
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
		mp.people.set_once({ $name: "anonymous", $Created: new Date().toISOString(), $email: "anonymous", $phone: "anonymous" });
	} catch (e) {
		if (opts.debug) console.log(e);
	}
}

/*
----------
THIRD PARTY
----------
*/

//default: off
export function trackYoutubeVideos(mp) {
	// enable youtube iframe API; callback to onYouTubeIframeAPIReady
	const tag = document.createElement("script");
	tag.id = "mixpanel-iframe-tracker";
	tag.src = "https://www.youtube.com/iframe_api";
	const firstScriptTag = document.getElementsByTagName("script")[0] || document.getElementsByTagName("body")[0].children[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	const videos = uniqueNodes(this.query(YOUTUBE_SELECTOR)).filter(frame => frame.src.includes("youtube.com/embed"));

	for (const video of videos) {
		this.trackedElements.push(video);
		if (!video.id) {
			video.id = new URL(video.src).pathname.replace("/embed/", "");
		}

		// note: enabling the iframe API triggers a redirect on the video, causing it to "flash"
		if (!video.src.includes("enablejsapi")) {
			const newSRC = new URL(video.src);
			newSRC.searchParams.delete("enablejsapi");
			newSRC.searchParams.append("enablejsapi", 1);
			video.src = newSRC.toString();
		}
	}

	// this called by youtube's iframe api and needs to be named as such
	window.onYouTubeIframeAPIReady = function () {
		const videos = ezTrack.query(YOUTUBE_SELECTOR).filter(frame => frame.src.includes("youtube.com/embed"));
		for (const video of videos) {
			bindTrackingToVideo(video.id);
		}
	};

	function bindTrackingToVideo(videoId) {
		// eslint-disable-next-line no-undef, no-unused-vars
		const player = new YT.Player(videoId, {
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
	}

	function getVideoInfo(player) {
		const videoInfo = player.getVideoData();
		const videoProps = {
			"VIDEO → quality": player.getPlaybackQuality(),
			"VIDEO → length (sec)": player.getDuration(),
			"VIDEO → elapsed (sec)": player.getCurrentTime(),
			"VIDEO → url": player.getVideoUrl(),
			"VIDEO → title": videoInfo.title,
			"VIDEO → id": videoInfo.video_id,
			"VIDEO → author": videoInfo.author,
			"VIDEO → fullscreen": !(document.fullscreenElement === null)
		};
		return videoProps;
	}

	function onPlayerReady(event) {
		const videoInfo = getVideoInfo(event.target);
		mp.track("youtube player load", videoInfo);
		mp.time_event("youtube video started");
	}

	function onPlayerStateChange(event) {
		trackPlayerChanges(event.data, event.target);
	}

	//player states: https://developers.google.com/youtube/iframe_api_reference#Playback_status
	function trackPlayerChanges(playerStatus, player) {
		const videoInfo = getVideoInfo(player);
		const props = { ...videoInfo, ...statefulProps(false) };

		switch (playerStatus) {
			case -1:
				//mp.track('youtube video unstarted but ready', videoInfo);
				break;
			case 0:
				mp.track("youtube video finish", props);
				break;
			case 1:
				mp.track("youtube video play", props);
				mp.time_event("youtube video finish");
				break;
			case 2:
				mp.track("youtube video pause", props);
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

export function getEZTrackConfig() {
	return this.opts;
}

export function uniqueNodes(arrayOfNodes) {
	return [...new Set(arrayOfNodes)];
}

export function generateTabId(token, length = 32) {
	try {
		const existingId = window.sessionStorage.getItem(`MPEZTrack_Tab_${token}`);
		if (existingId) {
			this.tabId = existingId;
			return { "SESSION → tab id": existingId };
		}

		//https://stackoverflow.com/a/1349426/4808195
		const result = [];
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
		}
		const uid = result.join("");
		this.tabId = uid;
		window.sessionStorage.setItem(`MPEZTrack_Tab_${token}`, uid);

		return {
			"SESSION → tab id": uid
		};
	} catch (e) {
		return {};
	}
}

export function clearExistingMixpanelQueue(token, opts) {
	try {
		const storageKey = `__mpq_${token}_ev`;
		const existingQueue = localStorage.getItem(storageKey);
		if (existingQueue) {
			const cleanedQueue = JSON.parse(existingQueue).filter(q => q.payload.event !== "page lost focus");
			localStorage.setItem(storageKey, JSON.stringify(cleanedQueue));
			if (opts.debug && opts.logProps) console.log("cleared events queue");
			return true;
		}

		return false;
	} catch (e) {
		if (opts.debug && opts.logProps) {
			console.log("failed to clear queue");
			console.log(e);
		}
		return false;
	}
}

//put it in global namespace 🤠
window.mpEZTrack = ezTrack;
