export const SUPER_PROPS = {
	"PAGE → url (/)": decodeURIComponent(window.location.pathname),
	"PAGE → hash (#)": window.location.hash,
	"PAGE → params (?)": qsToObj(window.location.search),	
	"PAGE → height": window.innerHeight,
	"PAGE → width": window.innerWidth,	
	"PAGE → title": document.title,	
	"SESSION → # page": window.history.length,
	"DEVICE → pixel ratio": window.devicePixelRatio,
	
	// https://developer.mozilla.org/en-US/docs/Web/API/Navigator
	"DEVICE → language": window.navigator.language,	
	"DEVICE → bandwidth": window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
	"DEVICE → memory (GB)": window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
	"DEVICE → platform": window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
	"DEVICE → is mobile?": window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
	"$source": "mpEZTrack"
};

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
export const LISTENER_OPTIONS = {
	"passive": true
};

// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/API/Element
export const STANDARD_FIELDS = (ev) => ({
	"ELEM → classes": [...ev.target.classList],
	"ELEM → id": ev.target.id,
	"ELEM → height": ev.target.offsetHeight,
	"ELEM → width": ev.target.offsetWidth,
	"ELEM → tag (<>)": "".concat('<', ev.target.tagName, '>'),
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
export const LINK_SELECTORS = String.raw`a`;
export const LINK_FIELDS = (ev) => ({
	"LINK → url": ev.target.href,
	"LINK → text": ev.target.textContent,
	"LINK → target": ev.target.target,
	"LINK → name": ev.target.name,
	"LINK → child": ev.target.innerHTML
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
export const BUTTON_SELECTORS = String.raw`button, .button, .btn, input[type="button"], input[type="file"], input[type="search"]`;
export const BUTTON_FIELDS = (ev) => ({
	"BUTTON → disabled": ev.target.disabled,
	"BUTTON → text": ev.target.textContent,
	"BUTTON → name": ev.target.name
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
export const FORM_SELECTORS = String.raw`form`;
export const FORM_FIELDS = (ev) => ({
	"FORM → # inputs": ev.target.length,
	"FORM → name": ev.target.name,
	"FORM → id": ev.target.id,
	"FORM → method": ev.target.method,
	"FORM → action": ev.target.action,
	"FORM → encoding": ev.target.encoding
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
export const DROPDOWN_SELECTOR = String.raw`select, datalist, input[type="radio"], input[type="checkbox"]`
export const DROPDOWN_FIELDS = (ev) => ({
	"OPTION → name" : ev.target.name,
	"OPTION → id": ev.target.id,
	"OPTION → value" : ev.target.value,
	"OPTION → choices" : ev.target.innerText.split('\n'), //suss ... but .textContent looks weird...
	"CONTENT → labels": [...ev.target.labels].map(label => label.textContent)

})

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
export const INPUT_SELECTOR = String.raw`input[type="text"], input[type="email"], textarea`
export const INPUT_FIELDS = (ev) => ({
	"CONTENT → user content" : ev.target.value,
	"CONTENT → placeholder" : ev.target.placeholder,
	"CONTENT → labels": [...ev.target.labels].map(label => label.textContent)

})

export const ALL_SELECTOR = String.raw`*`;

// 🚨 guard against password fields 🚨
export const ANY_TAG_FIELDS = (ev, guard = false) => ({	
	"ELEM → text": guard ? "******" : ev.target.textContent || ev.target.value,
	"ELEM → is editable?": ev.target.isContentEditable
	
});

export const CONDITIONAL_FIELDS = (ev) => {
	const result = {};
	
	// data-* attrs
	if (Object.keys(ev.target.dataset).length > 0) {
		result['ELEM → data'] = parseDatasetAttrs(ev.target.dataset)
	}

	if (ev.target.src) {
		result["ELEM → source"] = ev.target.src
	}

	if (ev.target.alt) {
		result["ELEM → desc"] = ev.target.alt
	}
	
	

	return result;
}

export const YOUTUBE_SELECTOR = String.raw`iframe`;


function qsToObj(queryString) {
	try {
		const parsedQs = new URLSearchParams(queryString);
		const params = Object.fromEntries(urlParams);
		return params
	}

	catch (e)  {
		return {}
	}
}

//try to get internal tag data?
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
function parseDatasetAttrs(dataset) {
	try {
		return {...dataset}
	}

	catch (e) {
		return {}
	}
}