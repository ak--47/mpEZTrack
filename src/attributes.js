export const SUPER_PROPS = {
	"PAGE → url (/)": decodeURIComponent(window.location.pathname),
	"PAGE → hash (#)": window.location.hash,
	"PAGE → params (?)": qsToObj(window.location.search),	
	"PAGE → height": window.innerHeight,
	"PAGE → width": window.innerWidth,
	"PAGE → title": document.title,	
	"SESSION → # page": window.history.length,
	"DEVICE → language": window.navigator.language,	
	"DEVICE → pixel ratio": window.devicePixelRatio,
	"DEVICE → bandwidth": window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
	"DEVICE → memory (GB)": window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
	"DEVICE → platform": window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
	"DEVICE → is mobile?": window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
	"$source": "mpEZTrack"
};

export const LISTENER_OPTIONS = {
	"passive": true
};

export const STANDARD_FIELDS = (ev) => ({
	"ELEM → classes": [...ev.target.classList],
	"ELEM → id": ev.target.id,
	"ELEM → height": ev.target.offsetHeight,
	"ELEM → width": ev.target.offsetWidth
});

export const LINK_SELECTORS = String.raw`a`;
export const LINK_FIELDS = (ev) => ({
	"LINK → url": ev.target.href,
	"LINK → text": ev.target.innerText,
	"LINK → target": ev.target.target,
	"LINK → name": ev.target.name,
	"LINK → child": ev.target.innerHTML
});

export const BUTTON_SELECTORS = String.raw`button, .button, .btn`;
export const BUTTON_FIELDS = (ev) => ({
	"BUTTON → disabled": ev.target.disabled,
	"BUTTON → text": ev.target.innerText,
	"BUTTON → name": ev.target.name
});

export const FORM_SELECTORS = String.raw`form`;
export const FORM_FIELDS = (ev) => ({
	"FORM → # inputs": ev.target.length,
	"FORM → name": ev.target.name,
	"FORM → id": ev.target.id,
	"FORM → method": ev.target.method,
	"FORM → action": ev.target.action,
	"FORM → encoding": ev.target.encoding
});

export const DROPDOWN_SELECTOR = String.raw`select, datalist, input[type="radio"]`
export const DROPDOWN_FIELDS = (ev) => ({
	"OPTION → name" : ev.target.name,
	"OPTION → id": ev.target.id,
	"OPTION → value" : ev.target.value,
	"OPTION → text" : ev.target.innerText

})

export const ALL_SELECTOR = String.raw`*`;

//todo guard against passwords
export const ANY_TAG_FIELDS = (ev, guard = false) => ({
	"ELEM → tag (<>)": "".concat('<', ev.target.tagName, '>'),
	"ELEM → text": guard ? "******" : ev.target.innerText || ev.target.value,
	"ELEM → is editable?": ev.target.isContentEditable
});

export const YOUTUBE_SELECTOR = String.raw`iframe`;


// try to parse query params
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
function parseDataset(dataset) {
	try {
		return {...dataset}
	}

	catch (e) {
		return {}
	}
}