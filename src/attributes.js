/*
-----------------
ENVIORMENT VALUES
-----------------
*/

// always on
export const PAGE_PROPS = {
	"PAGE → full url (/)": decodeURIComponent(document.location.href),
	"PAGE → short url (/)": decodeURIComponent(window.location.pathname),
	"PAGE → hash (#)": window.location.hash,
	"PAGE → url params (?)": qsToObj(window.location.search),
	"PAGE → height": window.innerHeight,
	"PAGE → width": window.innerWidth,
	"PAGE → title": document.title,
	"SESSION → # pages": window.history.length,
	"$source": "mpEZTrack"
};

export const DEVICE_PROPS = (mixpanel) => {
	const { $os, $browser, $referrer, $referring_domain, $browser_version, $screen_height, $screen_width } = mixpanel._.info.properties();
	//ugh side fx
	mixpanel.ez.register_once({ "DEVICE → first referrer": $referrer, "DEVICE → first referring domain": $referring_domain });

	return {
		"DEVICE → operating system": $os,
		"DEVICE → browser": $browser,
		"DEVICE → browser version": $browser_version,
		"DEVICE → last referrer": $referrer,
		"DEVICE → last referring domain": $referring_domain,
		"DEVICE → screen height (px)": $screen_height,
		"DEVICE → screen width (px)": $screen_width,
		"DEVICE → screen dim": `${window.screen?.width} x ${window.screen?.height}`,
		"DEVICE → language": window.navigator.language,
		"DEVICE → pixel ratio": window.devicePixelRatio,
		"DEVICE → bandwidth": window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
		"DEVICE → memory (GB)": window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
		"DEVICE → platform": window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
		"DEVICE → is mobile?": window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
	};

};

export const BLACKLIST_ELEMENTS = String.raw`*[type="password"], *[type="hidden"], *.sensitive, *.pendo-ignore, *[data-heap-redact-text], *[data-heap-redact-attributes], label`;

export const LISTENER_OPTIONS = {
	"passive": true
};


/*
------------------
SELECTORS + FIELDS
------------------
*/


export const STANDARD_FIELDS = (el, label = `ELEM`) => ({
	[`${label} → classes`]: [...el.classList.entries()].map(className => className[1]), 
	[`${label} → height`]: el.offsetHeight,
	[`${label} → width`]: el.offsetWidth,
	[`${label} → tag (<>)`]: "".concat('<', el.tagName, '>'),
	...conditionalFields(el, label),
	...enumNodeProps(el, label)
});

export const LINK_SELECTORS = String.raw`a`;
export const LINK_FIELDS = (el, label = `LINK`) => ({
	[`${label} → text`]: squish(el.textContent)
});

export const BUTTON_SELECTORS = String.raw`button, .button, .btn, input[type="button"], input[type="file"], input[type="image"], input[type="submit"], input[type="reset"]`;
export const BUTTON_FIELDS = (el) => ({
	"BUTTON → text": squish(el.textContent)
});

export const FORM_SELECTORS = String.raw`form`;
export const FORM_FIELDS = (el) => ({
	"FORM → # inputs": el.length,
	"FORM → method": el.method,
	"FORM → action": el.action,
	"FORM → encoding": el.encoding
});

export const DROPDOWN_SELECTOR = String.raw`select, input[list], input[type="radio"], input[type="checkbox"], input[type="range"], input[type="color"], input[type="range"]`;
export const DROPDOWN_FIELDS = (el) => {
	let props = {
		"OPTION → user selected": el.value === 'on' ? el.checked : el.value,
		"OPTION → labels": [...el.labels].map(label => label.textContent?.trim())
	};

	// solve for possible choices
	try {
		let choices = el.innerText.split('\n');
		if (choices.length > 1) {
			props["OPTION → choices"] = choices;
		}
		else if (el?.list) {
			choices = [...el.list.children].map(opt => opt.value);
			props["OPTION → choices"] = choices;
		}
	}
	catch (e) {
		//noop
		(() => { })();
	}

	return props;
};

export const INPUT_SELECTOR = String.raw`input[type="text"], input[type="email"], input[type="url"], input[type="search"], textarea`;
export const INPUT_FIELDS = (el) => ({
	"CONTENT → user content": isSensitiveData(el.value) ? "******" : el.value,
	"CONTENT → labels": [...el.labels].map(label => squish(label.textContent))
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

export const VIDEO_SELECTOR = String.raw`video`;
export const VIDEO_FIELDS = (el) => ({
	"VIDEO → watch time": el.currentTime,
	"VIDEO → total time": el.duration,
	"VIDEO → watch %": Number(Number(el.currentTime / el.duration * 100).toFixed(2)),
	"VIDEO → autoplay?": el.autoplay,
	"VIDEO → controls visible?": el.controls,
	"VIDEO → loops?": el.loop,
	"VIDEO → muted?": el.muted,
	"VIDEO → thumbnail": el.poster,
	"VIDEO → source(s)": el.src || [...el.querySelectorAll('source')].map(source => source.src),
	"VIDEO → source type(s)": el.src.split(".").slice(-1)[0] || [...el.querySelectorAll('source')].map(source => source.type),
});

export const YOUTUBE_SELECTOR = String.raw`iframe`;

/*
---------
UTILITIES
---------
*/


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

	let potentialPassEl = false;

	loopAttributes: for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
		att = atts[i];
		let potentialPassAttr = false;
		let keySuffix = mapReplace(att.name, replaceAttrs);
		let keyName = `${label} → ${keySuffix}`;
		let val = att.value?.trim();

		if (keySuffix?.toLowerCase()?.includes('pass')) {
			potentialPassAttr = true;
			potentialPassEl = true;
		}
		if (keySuffix?.startsWith("on")) continue loopAttributes; //skip inline js handlers
		if (keySuffix === "nonce") continue loopAttributes; //skip crypto
		if (keySuffix === "d") continue loopAttributes; //skip svg paths

		if (boolAttrs.some(attr => attr === att.name)) {
			//attrs which have no value are "boolean" and therefore true when present
			val = true;
			keyName += "?";
		}

		if (potentialPassAttr) val = `******`;
		if (isSensitiveData(val)) val = `******`;

		if (val) result[keyName] = val; //note value might be blank

	}

	//tags to delete
	delete result[`${label} → class (delete)`];
	delete result[`${label} → style`];

	// 🚨 guard against sensitive fields
	if (potentialPassEl) {
		//scrub all data inputs
		result[`${label} → user content`] = `******`;
		result[`${label} → text`] = `******`;
		result[`${label} → value`] = `******`;
	}

	return result;
}

export function conditionalFields(el, label = "ELEM") {
	const results = {};
	const labelString = `${label} → label`;
	// LABELS
	// sometimes lables are not explicitly tied to elements
	if (Array.from(el?.labels || "").length === 0) {
		// siblings
		if (el.previousElementSibling?.nodeName === `LABEL`) {
			results[labelString] = el.previousElementSibling.textContent.trim();
		}
		if (el.nextElementSibling?.nodeName === `LABEL`) {
			results[labelString] = el.nextElementSibling.textContent.trim();
		}

		// parents + children
		if (el.parentElement?.nodeName === `LABEL`) {
			results[labelString] = el.parentElement.textContent.trim();
		}
		if (el.childNodes[0]?.nodeName === `LABEL`) {
			results[labelString] = el.childNodes[0].textContent.trim();
		}

		//other possibilities for the label
		if (el.parentElement.title) results[labelString] = el.parentElement.title.trim();
		if (el.parentElement.name) results[labelString] = el.parentElement.name.trim();
		if (el.parentElement.id) results[labelString] = el.parentElement.id.trim();

		// otherwise, recursively find the closest textContent by moving up the DOM
		if (!results[labelString]) {
			// eslint-disable-next-line no-inner-declarations
			function findLabelRecursively(el) {
				if (!el) {
					return false;
				}

				if (el.textContent.trim() !== "") {
					results[labelString] = truncate(squish(el.textContent));
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

	if (typeof el.required === 'boolean') {
		results[`${label} → required?`] = el.checked;
	}

	// // CHILDREN
	// if (el.childElementCount > 0) {
	// 	results[`${label} → child`] = squish(el.innerHTML);
	// }

	return results;
}

/*
-------
HELPERS
-------
*/

export function linkOrNav(el) {
	const href = el?.getAttribute('href') || "";
	const linkType = {
		eventName: ``,
		label: ``
	};

	if (href?.startsWith('#')) {
		linkType.eventName = `navigation`;
		linkType.label = `NAV`;
	}
	else if (href?.startsWith('/')) {
		linkType.eventName = `navigation`;
		linkType.label = `NAV`;
	}
	else if (href?.includes(this.host)) {
		linkType.eventName = `navigation`;
		linkType.label = `NAV`;
	}
	else if (href?.startsWith('javascript')) {
		linkType.eventName = `navigation`;
		linkType.label = `NAV`;
	}
	else if (!href) {
		linkType.eventName = `navigation`;
		linkType.label = `NAV`;
	}

	else {
		linkType.eventName = `link`;
		linkType.label = `LINK`;
	}

	return linkType;

}

export function isSensitiveData(text = "") {
	if (!text) return false;
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
	if (!cardNo) return false;
	if (typeof cardNo !== "string") cardNo = cardNo?.toString();
	if (cardNo === "0") return false;
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
	if (!ssn) return false;
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
	try {
		var doc = new DOMParser().parseFromString(str, "text/html");
		return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
	}

	catch (e) {
		return false;
	}
}

export function parseDatasetAttrs(dataset) {

	try {
		return { ...dataset };
	}

	catch (e) {
		return {};
	}
}

