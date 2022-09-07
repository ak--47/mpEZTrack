const { SNIPPET,
	SHADOW_DOM,
	SUPER_PROPS, 
	BUTTON_SELECTORS, 
	LINK_SELECTORS, 
	FORM_SELECTORS,
	YOUTUBE_SELECTOR,
	ALL_SELECTOR } = require('./magicStrings');

// mp snippet: https://developer.mixpanel.com/docs/javascript-quickstart#installation-option-2-html
exports.mpSnippet = function () {
	return SNIPPET;
};

// for piercing shadows: https://github.com/Georgegriff/query-selector-shadow-dom#readme
exports.shadowDomSelector = function () {
	return SHADOW_DOM;
};

// super props... ref: https://developer.mozilla.org/en-US/docs/Web/API/Window#properties
const standardProps = SUPER_PROPS;


// init: https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpanelset_config
// note: tracking pageExits will flip the api_transport to 'sendBeacon'
exports.init = function (params = {}) {
	return `\n\nmixpanel.init("${params?.token}", {
            cross_subdomain_cookie: true,
            debug: ${params?.debug},
            persistence: "localStorage",
            api_transport: "XHR",
            ip: true,
            ignore_dnt: true,
            loaded: function (mp) {
		mp.register({${params?.superProps ? standardProps : ""}});		
		
		${params?.debug ? "mp.ezselector = qs.querySelectorAllDeep" : ""}

		try {
			EZTrackViews(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackExits(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackLinks(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackButtons(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {			
			EZTrackForms(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackProfiles(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackYoutube(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackAllClicks(mp);
		}
		catch (e) {
			${params?.logErrors ? "console.error(e)" : ""}
		}
	}
}, "ez");\n\n`;
};

// COMPONENTS

exports.trackViews = function (params) {
	const funcTitle = "EZTrackViews";
	if (params?.pageViews) {
		return `function ${funcTitle}(mp) {
	mp.track('page view')
	${params?.pageExits ? "mp.time_event('page exit')" : ""}
}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

exports.trackExits = function (params) {
	const funcTitle = "EZTrackExits";
	if (params?.pageExits) {
		// https://stackoverflow.com/a/2387222
		return `function ${funcTitle}(mp) {	
	window.addEventListener('beforeunload', () => { 
		mp.set_config({api_transport: 'sendBeacon', batch_flush_interval_ms: 0});
		mp.track('page exit', {'scroll %': ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100)}) 
	}, false);
}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters
const listenerOptions = `passive: true`;

exports.trackLinks = function (params) {
	const funcTitle = "EZTrackLinks";
	if (params?.linkClicks) {
		return `function ${funcTitle}(mp) {
		
	const links = [...${exports.getAllTags(LINK_SELECTORS)}]
	for (const link of links) {
		link.addEventListener('click', (e) => {
			try {
				mp.track('link click', { ${exports.mapAttrs('link')} })
			}
			catch (e) {
				${params?.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}})
	}

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

//todo: links are also frequently .button or .btn
exports.trackButtons = function (params) {
	const funcTitle = "EZTrackButtons";
	if (params?.buttonClicks) {
		return `function ${funcTitle}(mp) {
	
	const buttons = [...${exports.getAllTags(BUTTON_SELECTORS)}]
	for (const button of buttons) {
		button.addEventListener('click', (e) => {
			try {
				mp.track('button click', { ${exports.mapAttrs('button')} })
			}
			catch (e) {
				${params?.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}})
	}

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

exports.trackForms = function (params) {
	const funcTitle = "EZTrackForms";
	if (params?.formSubmits) {
		return `function ${funcTitle}(mp) {

	const forms = [...${exports.getAllTags(FORM_SELECTORS)}]	
	for (const form of forms) {		
		form.addEventListener('submit', (e) => {
			try {				
				mp.track('form submit', { ${exports.mapAttrs('form')} })
			}
			catch (e) {
				${params?.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}})
	}

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

// https://cssdeck.com/blog/css-snippets-how-to-add-a-cursor-to-all-clickable-elements/
exports.trackClicks = function (params) {
	const funcTitle = "EZTrackAllClicks";
	if (params?.allClicks) {
		return `function ${funcTitle}(mp) {

	const allThings = [...${exports.getAllTags(ALL_SELECTOR)}].filter(node => node.children.length === 0)${params?.linkClicks ? ".filter(e => e.tagName !== 'A')" : ""}${params?.buttonClicks ? ".filter(e => e.tagName !== 'BUTTON')" : ""}${params?.formSubmits ? ".filter(e => e.tagName !== 'FORM')" : ""}
	for (const thing of allThings) {
		thing.addEventListener('click', (e) => {
			try {
				mp.track('page click', { ${exports.mapAttrs('thing')} })
			}
			catch (e) {
				${params?.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}, once: true})
	}
			
}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

// todo: https://developers.google.com/youtube/iframe_api_reference
exports.trackYoutube = function (params) {
	const funcTitle = "EZTrackYoutube";
	if (params?.youtube) {
		return `function ${funcTitle}(mp) {
			const tag = document.createElement('script');
			tag.id = 'mixpanel-iframe-tracker';
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
			// called by youtube's iframe api
			window.onYouTubeIframeAPIReady = function() {		
				const videos = [...${exports.getAllTags(YOUTUBE_SELECTOR)}].filter(frame => frame.src.includes('youtube.com/embed'))
					for (const video of videos) {
						bindTrackingToVideo(video.id)
					}
			}
		
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
					'video quality': player.getPlaybackQuality(),
					'video length (sec)': player.getDuration(),
					'video ellapsed (sec)': player.getCurrentTime(),
					'video url': player.getVideoUrl(),
					'video title': videoInfo.title,
					'video id': videoInfo.video_id,
					'video author': videoInfo.author		
				}
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
						mp.track('youtube video finish', videoInfo);
					break;
		
					case 1:
						mp.track('youtube video play', videoInfo);            
						mp.time_event('youtube video finish');
					break;
		
					case 2:
						mp.track('youtube video pause', videoInfo);
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
		
			const videos = [...${exports.getAllTags(YOUTUBE_SELECTOR)}].filter(frame => frame.src.includes('youtube.com/embed'))
			
			for (video of videos) {
				if (!video.src.includes('enablejsapi')) {
					const newSRC = new URL(video.src);
					newSRC.searchParams.delete('enablejsapi')
					newSRC.searchParams.append('enablejsapi', 1);
					video.src = newSRC.toString()
		
				}
		
				if (!video.id) {
					video.id = new URL(video.src).pathname.replace("/embed/", "");
				}
		
			}
}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

exports.trackProfiles = function (params) {
	const funcTitle = "EZTrackProfiles";
	if (params?.userProfiles) {
		return `function ${funcTitle}(mp) {

	mp.identify(mp.get_distinct_id());
	mp.people.set({"last page viewed":window.location.href, "language": window.navigator.language});
	mp.people.set_once({ "$name": "anonymous"});
	mp.people.increment("total # pages");
	mp.people.set_once({"$Created": new Date().toISOString() });

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

//HELPERS

exports.iffe = function (string) {
	return `(function () {
try {
${string}
}
catch (e) {}
})();`;
};

exports.parseParams = function parseQueryParams(params = {}) {
	// params = https://expressjs.com/en/api.html#req.query
	try {
		const urlParamsWithTypes = {};
		for (let key in params) {
			urlParamsWithTypes[key] = exports.getTypes(params[key]);
		}

		return urlParamsWithTypes;
	}
	//some assumption i had about query params is wrong
	catch (e) {
		return params;
	}
};

exports.getTypes = function coerceStringsToBool(value) {
	//  Boolean('false') === true... soo...
	const queryParamValue = value?.toLowerCase();
	switch (queryParamValue) {
		case 'false': {
			return false;
		}
		case 'true': {
			return true;
		}
		case '0': {
			return false;
		}
		case '1': {
			return true;
		}
		case 'undefined': {
			return false;
		}
		case 'null': {
			return false;
		}
		case '': {
			return false;
		}
		//these will eventually be co-erced to true
		default: {
			return value;
		}
	}
};

// try qsDeep; fallback on qsAll
exports.getAllTags = function selectsAllElementsOnPage(selector) {
	return `(() => {
		try { return qs.querySelectorAllDeep('${selector}')}
		catch (e) { return document.querySelectorAll('${selector}')}
	  })()`;

};


// https://developer.mozilla.org/en-US/docs/Web/API/Element
exports.mapAttrs = function mapStandardAttributesFromElements(elementType) {
	const standardElementFields = `
				classes : e.target.className.split(" ").filter(a => a),
				id: e.target.id`;

	let additionalFields = ``;

	switch (elementType) {
		case `link`:
			additionalFields += `
			url: e.target.href,
				text: e.target.innerHTML,`;
			break;

		case `button`:
			additionalFields += `
			disabled: e.target.disabled,
				text: e.target.innerText,
				buttonName: e.target.name,`;
			break;

		case `form`:
			additionalFields += `
			numOfInputs: e.target.length,
				formName: e.target.name,
				formId: e.target.id,
				formMethod: e.target.method,
				formAction: e.target.action,
				formEncoding: e.target.encoding,			
			`;
			break;

		default:
			additionalFields += `
			tagName: "".concat('<', e.target.tagName ,'>'),
				text: e.target.innerText || e.target.value,			
			`;
			break;
	}


	const attributes = additionalFields.concat(standardElementFields).trim();
	return attributes;
};


function noop(funcName = "") {
	return `function ${funcName}(){()=>{}}\n\n`;
	// // perf research: https://gist.github.com/ak--47/4221ccaffcbbe1830bfd5e5c05dc09d3
	// return `function ${funcName}(){Function.prototype()};\n\n`
}