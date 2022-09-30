/* eslint-disable no-inner-declarations */

/*
------------------
SELECTORS + FIELDS
------------------
*/


export const SUPER_PROPS = {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window
	"PAGE → url (/)": decodeURIComponent(window.location.pathname),
	"PAGE → hash (#)": window.location.hash,
	"PAGE → url params (?)": qsToObj(window.location.search),
	"PAGE → height": window.innerHeight,
	"PAGE → width": window.innerWidth,
	"PAGE → title": document.title,
	"SESSION → # pages": window.history.length,
	"DEVICE → pixel ratio": window.devicePixelRatio,

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/screen
	"DEVICE → screen dim": `${window.screen?.width} x ${window.screen?.height}`,

	// https://developer.mozilla.org/en-US/docs/Web/API/Navigator
	"DEVICE → language": window.navigator.language,
	"DEVICE → bandwidth": window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
	"DEVICE → memory (GB)": window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
	"DEVICE → platform": window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
	"DEVICE → is mobile?": window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
	"$source": "mpEZTrack"
};

export const BLACKLIST_ELEMENTS = String.raw`*[type="password"], *[type="hidden"], *.sensitive, *.pendo-ignore, *[data-heap-redact-text], *[data-heap-redact-attributes]`;

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
	"LINK → text": squish(el.textContent)
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
});

export const BUTTON_SELECTORS = String.raw`button, .button, .btn, input[type="button"], input[type="file"]`;
export const BUTTON_FIELDS = (el) => ({
	"BUTTON → text": squish(el.textContent)
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
	"OPTION → choices": el.innerText.split('\n'),
	"OPTION → labels": [...el.labels].map(label => label.textContent?.trim())
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist

});

export const INPUT_SELECTOR = String.raw`input[type="text"], input[type="email"], input[type="url"], input[type="search"], textarea, *[contenteditable="true"]`;
export const INPUT_FIELDS = (el) => ({
	"CONTENT → user content": isSensitiveData(el.value) ? "******" : el.value,
	"CONTENT → labels": [...el.labels].map(label => squish(label.textContent))
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable
});

// 🚨 guard against sensitive fields 🚨
export const ALL_SELECTOR = String.raw`*:not(script):not(title):not(meta):not(link):not([type="password"])`;
export const ANY_TAG_FIELDS = (el, guard = false) => {
	const fields = {
		"ELEM → text": guard ? "******" : el.textContent?.trim() || el.value?.trim(),
		"ELEM → is editable?": el.isContentEditable
	};

	if (isSensitiveData(fields["ELEM → text"])) {
		fields["ELEM → text"] = "******";
	}

	return fields;
};

export const YOUTUBE_SELECTOR = String.raw`iframe`;

/*
---------
UTILITIES
---------
*/


export function enumNodeProps(el, label = "ELEM") {
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
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
	delete result[`${label} → class (delete)`];

	return result;
}

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

	// CHECKBOXES
	if (typeof el.checked === 'boolean') {
		results[`${label} → checked`] = el.checked;
	}

	// CHILDREN
	if (el.childElementCount > 0) {
		results[`${label} → child`] = squish(el.innerHTML);
	}

	return results;
}

/*
-------
HELPERS
-------
*/

export function isSensitiveData(text) {
	const sensitiveTests = [isCreditCardNo, isSSN];
	const tests = sensitiveTests.map((testFn) => {
		return testFn(text);
	});

	return tests.some(bool => bool);
}

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
}

export function qsToObj(queryString) {
	try {
		const parsedQs = new URLSearchParams(queryString);
		const params = Object.fromEntries(parsedQs);
		return params;
	}

	catch (e) {
		return {};
	}
}


export function isCreditCardNo(cardNo = "") {
	// https://stackoverflow.com/a/30727110
	var s = 0;
	var doubleDigit = false;
	for (var i = cardNo.length - 1; i >= 0; i--) {
		var digit = +cardNo[i];
		if (doubleDigit) {
			digit *= 2;
			if (digit > 9)
				digit -= 9;
		}
		s += digit;
		doubleDigit = !doubleDigit;
	}
	return s % 10 == 0;
}


export function isSSN(ssn = "") {
	// https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-15.php
	var regexp = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;

	if (regexp.test(ssn)) {
		return true;
	}
	else {
		return false;
	}
}

/*
-------
UNUSED
-------
*/

export function isHTML(str) {
	// https://stackoverflow.com/a/15458968
	var doc = new DOMParser().parseFromString(str, "text/html");
	return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

export function parseDatasetAttrs(dataset) {
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
	try {
		return { ...dataset };
	}

	catch (e) {
		return {};
	}
}

