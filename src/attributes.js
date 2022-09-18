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
export const STANDARD_FIELDS = (ev, label = `ELEM`) => ({
	[`${label} → classes`]: [...ev.target.classList],
	[`${label} → id`]: ev.target.id,
	[`${label} → height`]: ev.target.offsetHeight,
	[`${label} → width`]: ev.target.offsetWidth,
	[`${label} → tag (<>)`]: "".concat('<', ev.target.tagName, '>'),
	...enumNodeProps(ev.target, label),
	...conditialFields(ev.target, label)
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
export const LINK_SELECTORS = String.raw`a`;
export const LINK_FIELDS = (ev) => ({
	"LINK → url": ev.target.href,
	"LINK → text": ev.target.textContent?.trim(),
	"LINK → target": ev.target.target,
	"LINK → name": ev.target.name,
	"LINK → child": ev.target.innerHTML

});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
export const BUTTON_SELECTORS = String.raw`button, .button, .btn, input[type="button"], input[type="file"]`;
export const BUTTON_FIELDS = (ev) => ({
	"BUTTON → text": ev.target.textContent?.trim(),
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
export const DROPDOWN_SELECTOR = String.raw`select, datalist, input[type="radio"], input[type="checkbox"], input[type="range"]`;
export const DROPDOWN_FIELDS = (ev) => ({
	"OPTION → name": ev.target.name,
	"OPTION → id": ev.target.id,
	"OPTION → selected": ev.target.value,
	"OPTION → choices": ev.target.innerText.split('\n'), //suss ... but .textContent looks weird...
	"OPTION → labels": [...ev.target.labels].map(label => label.textContent?.trim())
});

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
export const INPUT_SELECTOR = String.raw`input[type="text"], input[type="email"], input[type="url"], input[type="search"], textarea`;
export const INPUT_FIELDS = (ev) => ({
	"CONTENT → user content": ev.target.value,
	"CONTENT → placeholder": ev.target.placeholder,
	"CONTENT → labels": [...ev.target.labels].map(label => label.textContent?.trim())
});

export const ALL_SELECTOR = String.raw`*`;

// 🚨 guard against password fields 🚨
export const ANY_TAG_FIELDS = (ev, guard = false) => ({
	"ELEM → text": guard ? "******" : ev.target.textContent?.trim() || ev.target.value?.trim(),
	"ELEM → is editable?": ev.target.isContentEditable
});

export const conditialFields = (ev, label = "ELEM") => {
	const result = {};

	// data-* attrs
	try {
		if (Object.keys(ev.target.dataset).length > 0) {
			result[`${label} → data`] = parseDatasetAttrs(ev.target.dataset);
		}
	}
	catch (e) { }

	try {
		if (ev.target.src) {
			result[`${label} → source`] = ev.target.src;
		}
	}
	catch (e) { }

	try {
		if (ev.target.alt) {
			result[`${label} → desc`] = ev.target.alt;
		}
	}
	catch (e) { }

	return result;
};

export const YOUTUBE_SELECTOR = String.raw`iframe`;


function qsToObj(queryString) {
	try {
		const parsedQs = new URLSearchParams(queryString);
		const params = Object.fromEntries(urlParams);
		return params;
	}

	catch (e) {
		return {};
	}
}

//try to get internal tag data?
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
function parseDatasetAttrs(dataset) {
	try {
		return { ...dataset };
	}

	catch (e) {
		return {};
	}
}

// is this a bad idea?
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
function enumNodeProps(el, label = "ELEM") {
	const result = {};
	// https://meiert.com/en/blog/boolean-attributes-of-html/
	const boolAttrs = [
		"allowfullscreen",
		"async",
		"autofocus",
		"autoplay",
		"checked",
		"controls",
		"default",
		"defer",
		"disabled",
		"formnovalidate",
		"ismap",
		"itemscope",
		"loop",
		"multiple",
		"muted",
		"nomodule",
		"novalidate",
		"open",
		"playsinline",
		"readonly",
		"required",
		"reversed",
		"selected",
		"truespeed"
	];
	for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
		att = atts[i];
		let keySuffix = att.name.replace("aria-", "DATA →").replace("data-", "DATA →"); // remove aria- and data- prefix
		let keyName = `${label} → ${keySuffix}`;
		let val = att.value?.trim();

		if (boolAttrs.some(attr => attr === att.name)) val = true; //attrs which have no value are "boolean" true

		result[keyName] = val;

	}

	return result;

}