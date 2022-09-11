export const SUPER_PROPS = {
	path: window.location.pathname,
	pixelRatio: window.devicePixelRatio,
	pageHeight: window.innerHeight,
	pageWidth: window.innerWidth,
	pageNum: window.history.length,
	language: window.navigator.language,
	pageTitle: document.title,
	connection: window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
	memory: window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
	platform: window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
	mobile: window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
	$source: "ezTrack"
};

export const LISTENER_OPTIONS = {
	"passive": true
}

export const STANDARD_FIELDS = (ev) => ({
	classes: ev.target.className.split(" ").filter(a => a),
	id: ev.target.id
});

export const LINK_SELECTORS = String.raw`a`;
export const LINK_FIELDS = (ev) => ({
	url: ev.target.href,
	text: ev.target.innerHTML
});

export const BUTTON_SELECTORS = String.raw`button, .button, .btn`;
export const BUTTON_FIELDS = (ev) => ({
	disabled: ev.target.disabled,
	text: ev.target.innerText,
	buttonName: ev.target.name
});

export const FORM_SELECTORS = String.raw`form`;
export const FORM_FIELDS = (ev) => ({
	numOfInputs: ev.target.length,
	formName: ev.target.name,
	formId: ev.target.id,
	formMethod: ev.target.method,
	formAction: ev.target.action,
	formEncoding: ev.target.encoding
});

export const ALL_SELECTOR = String.raw`*`;
export const ANY_TAG_FIELDS = (ev) => ({
	tagName: "".concat('<', ev.target.tagName, '>'),
	text: ev.target.innerText || ev.target.value
});

export const YOUTUBE_SELECTOR = String.raw`iframe`;