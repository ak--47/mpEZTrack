
/*
------------------
SELECTORS + FIELDS
------------------
*/


export const SUPER_PROPS = {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window
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


export const LISTENER_OPTIONS = {
	"passive": true

	// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
};

export const STANDARD_FIELDS = (el, label = `ELEM`) => ({
	[`${label} → classes`]: [...el.classList],
	[`${label} → height`]: el.offsetHeight,
	[`${label} → width`]: el.offsetWidth,
	[`${label} → tag (<>)`]: "".concat('<', el.tagName, '>'),
	...enumNodeProps(el, label),
	...conditionalFields(el, label)

	// https://developer.mozilla.org/en-US/docs/Web/API/Node
	// https://developer.mozilla.org/en-US/docs/Web/API/Element	
});


export const LINK_SELECTORS = String.raw`a`;
export const LINK_FIELDS = (el) => ({
	"LINK → text": squish(el.textContent),
	"LINK → target": el.target,
	"LINK → child": squish(el.innerHTML)

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
});


export const BUTTON_SELECTORS = String.raw`button, .button, .btn, input[type="button"], input[type="file"]`;
export const BUTTON_FIELDS = (el) => ({
	"BUTTON → text": squish(el.textContent),
	"BUTTON → child": squish(el.innerHTML)


	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
});


export const FORM_SELECTORS = String.raw`form`;
export const FORM_FIELDS = (el) => ({
	"FORM → # inputs": el.length,
	"FORM → method": el.method,
	"FORM → action": el.action,
	"FORM → encoding": el.encoding

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
});


export const DROPDOWN_SELECTOR = String.raw`select, datalist, input[type="radio"], input[type="checkbox"], input[type="range"]`;
export const DROPDOWN_FIELDS = (el) => ({
	"OPTION → selected": el.value,
	"OPTION → choices": el.innerText.split('\n'), //QQ suss ... but .textContent looks weird...
	"OPTION → labels": [...el.labels].map(label => label.textContent?.trim())

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist

});


export const INPUT_SELECTOR = String.raw`input[type="text"], input[type="email"], input[type="url"], input[type="search"], textarea`;
export const INPUT_FIELDS = (el) => ({
	"CONTENT → user content": el.value,
	"CONTENT → labels": [...el.labels].map(label => squish(label.textContent))

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
});

// 🚨 guard against password fields 🚨
export const ALL_SELECTOR = String.raw`*:not(script):not(title):not(meta):not(link):not([type="password"])`;
export const ANY_TAG_FIELDS = (el, guard = false) => ({
	"ELEM → text": guard ? "******" : el.textContent?.trim() || el.value?.trim(),
	"ELEM → is editable?": el.isContentEditable
});

export const YOUTUBE_SELECTOR = String.raw`iframe`;

/*
---------
UTILITIES
---------
*/


// https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
export function enumNodeProps(el, label = "ELEM") {
	const result = {};
	// https://meiert.com/en/blog/boolean-attributes-of-html/
	const boolAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled", "formnovalidate", "ismap", "itemscope", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "selected", "truespeed"];

	const replaceAttrs = {
		'aria-': 'DATA → ',
		'data-': 'DATA → ',
		'src': 'source',
		'alt': 'desc',
		'class': 'class (delete)'
	};

	loopAttributes: for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
		att = atts[i];
		let keySuffix = mapReplace(att.name, replaceAttrs);
		if (keySuffix?.toLowerCase()?.includes('pass')) continue loopAttributes; //no sneakily emedded password fields
		let keyName = `${label} → ${keySuffix}`;
		let val = att.value?.trim();

		if (boolAttrs.some(attr => attr === att.name)) val = true; //attrs which have no value are "boolean" and therefore true when present

		result[keyName] = val;

	}
	//classes are tracked elsewhere
	delete result[`${label} → class (delete)`]

	return result;
}

// for fields that won't always exist
export function conditionalFields(el, label = "ELEM") {
	const results = {};

	// LABELS
	// sometimes lables are not explicitly tied to elements
	if (Array.from(el?.labels || "").length === 0) {
		// siblings
		if (el.previousElementSibling?.nodeName === `LABEL`) {
			results[`${label} → label`] = el.previousElementSibling.textContent.trim();
		}
		if (el.nextElementSibling?.nodeName === `LABEL`) {
			results[`${label} → label`] = el.nextElementSibling.textContent.trim();
		}

		// parents + children
		if (el.parentElement?.nodeName === `LABEL`) {
			results[`${label} → label`] = el.parentElement.textContent.trim();
		}
		if (el.childNodes[0]?.nodeName === `LABEL`) {
			results[`${label} → label`] = el.childNodes[0].textContent.trim();
		}

		//other possibilities for the label
		if (el.parentElement.title) results[`${label} → label`] = el.parentElement.title.trim();
		if (el.parentElement.name) results[`${label} → label`] = el.parentElement.name.trim();
		if (el.parentElement.id) results[`${label} → label`] = el.parentElement.id.trim();

		// otherwise, recursively find the closest textContent by moving up the DOM
		if (!results[`${label} → label`]) {
			function findLabelRecursively(el) {
				if (!el) {
					return false;
				}

				if (el.textContent.trim() !== "") {
					results[`${label} → label`] = truncate(squish(el.textContent));
					return true;
				}

				else {
					findLabelRecursively(el?.parentElement);
				}
			}

			findLabelRecursively(el);
		}

	}


	return results;
};

/*
-------
HELPERS
-------
*/

export function escape(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function mapReplace(str, replacements) {
	var regex = [];

	for (var prop in replacements) {
		regex.push(escape(prop));
	}

	regex = new RegExp(regex.join('|'), "g");

	return str.replace(regex, function (match) {
		return replacements[match];
	});
}

export function squish(string) {
	const CONSECUTIVE_SPACES = /\s+/g;
	return string.trim().replace(CONSECUTIVE_SPACES, ' ');
}

export function truncate(text, n = 50, useWordBoundary = true) {
	if (!text) {
		return "";
	}
	if (text.length <= n) {
		return text;
	}
	var subString = text.substr(0, n - 1);
	return (useWordBoundary ?
		subString.substr(0, subString.lastIndexOf(' ')) :
		subString) + "...";
};



export function qsToObj(queryString) {
	try {
		const parsedQs = new URLSearchParams(queryString);
		const params = Object.fromEntries(urlParams);
		return params;
	}

	catch (e) {
		return {};
	}
}

// unused
// https://stackoverflow.com/a/15458968
export function isHTML(str) {
	var doc = new DOMParser().parseFromString(str, "text/html");
	return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

// unused
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
export function parseDatasetAttrs(dataset) {
	try {
		return { ...dataset };
	}

	catch (e) {
		return {};
	}
}

