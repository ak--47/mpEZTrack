// https://developer.mixpanel.com/docs/javascript-quickstart#installation-option-2-html
exports.mpSnippet = function () {	
	return String.raw`(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);`	
};

exports.shadowDomSelector = function () {
	return String.raw`var querySelectorShadowDom=function(e){function t(e,t,u,a){void 0===a&&(a=null),e=function(e){function t(){r&&(u.length>0&&/^[~+>]$/.test(u[u.length-1])&&u.push(" "),u.push(r))}var n,r,l,o,u=[],a=[0],s=0,h=/(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/,i=/^\s+$/,c=[/\s+|\/\*|["'>~+[(]/g,/\s+|\/\*|["'[\]()]/g,/\s+|\/\*|["'[\]()]/g,null,/\*\//g];for(e=e.trim();;){if(r="",(l=c[a[a.length-1]]).lastIndex=s,!(n=l.exec(e))){r=e.substr(s),t();break}if((o=s)<(s=l.lastIndex)-n[0].length&&(r=e.substring(o,s-n[0].length)),a[a.length-1]<3){if(t(),"["===n[0])a.push(1);else if("("===n[0])a.push(2);else if(/^["']$/.test(n[0]))a.push(3),c[3]=new RegExp(n[0],"g");else if("/*"===n[0])a.push(4);else if(/^[\])]$/.test(n[0])&&a.length>0)a.pop();else if(/^(?:\s+|[~+>])$/.test(n[0])&&(u.length>0&&!i.test(u[u.length-1])&&0===a[a.length-1]&&u.push(" "),1===a[a.length-1]&&5===u.length&&"="===u[2].charAt(u[2].length-1)&&(u[4]=" "+u[4]),i.test(n[0])))continue;u.push(n[0])}else u[u.length-1]+=r,h.test(u[u.length-1])&&(4===a[a.length-1]&&(u.length<2||i.test(u[u.length-2])?u.pop():u[u.length-1]=" ",n[0]=""),a.pop()),u[u.length-1]+=n[0]}return u.join("").trim()}(e);var s=u.querySelector(e);return document.head.createShadowRoot||document.head.attachShadow?!t&&s?s:n(e,",").reduce(function(e,s){if(!t&&e)return e;var h=n(s.replace(/^\s+/g,"").replace(/\s*([>+~]+)\s*/g,"$1")," ").filter(function(e){return!!e}).map(function(e){return n(e,">")}),i=h.length-1,c=o(h[i][h[i].length-1],u,a),f=function(e,t,n){return function(o){for(var u=t,a=o,s=!1;a&&!r(a);){var h=!0;if(1===e[u].length)h=a.matches(e[u]);else{var i=a,c=[].concat(e[u]).reverse(),f=Array.isArray(c),g=0;for(c=f?c:c[Symbol.iterator]();;){var d;if(f){if(g>=c.length)break;d=c[g++]}else{if((g=c.next()).done)break;d=g.value}var p=d;if(!i||!i.matches(p)){h=!1;break}i=l(i,n)}}if(h&&0===u){s=!0;break}h&&u--,a=l(a,n)}return s}}(h,i,u);return t?e=e.concat(c.filter(f)):(e=c.find(f))||null},t?[]:null):t?u.querySelectorAll(e):s}function n(e,t){return e.match(/\\?.|^$/g).reduce(function(e,n){return'"'!==n||e.sQuote?"'"!==n||e.quote?e.quote||e.sQuote||n!==t?e.a[e.a.length-1]+=n:e.a.push(""):(e.sQuote^=1,e.a[e.a.length-1]+=n):(e.quote^=1,e.a[e.a.length-1]+=n),e},{a:[""]}).a}function r(e){return e.nodeType===Node.DOCUMENT_FRAGMENT_NODE||e.nodeType===Node.DOCUMENT_NODE}function l(e,t){var n=e.parentNode;return n&&n.host&&11===n.nodeType?n.host:n===t?null:n}function o(e,t,n){void 0===e&&(e=null),void 0===n&&(n=null);var r=[];if(n)r=n;else{var l=function e(t){for(var n=0;n<t.length;n++){var l=t[n];r.push(l),l.shadowRoot&&e(l.shadowRoot.querySelectorAll("*"))}};t.shadowRoot&&l(t.shadowRoot.querySelectorAll("*")),l(t.querySelectorAll("*"))}return e?r.filter(function(t){return t.matches(e)}):r}return e.collectAllElementsDeep=o,e.querySelectorAllDeep=function(e,n,r){return void 0===n&&(n=document),void 0===r&&(r=null),t(e,!0,n,r)},e.querySelectorDeep=function(e,n,r){return void 0===n&&(n=document),void 0===r&&(r=null),t(e,!1,n,r)},Object.defineProperty(e,"__esModule",{value:!0}),e}({});`
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window#properties
const standardProps = `
		path: window.location.pathname,
		pixelRatio: window.devicePixelRatio,
		pageHeight: window.innerHeight,
		pageWidth: window.innerWidth,
		pageNum : window.history.length,
		language: window.navigator.language,	
		pageTitle: document.title,
		connection: window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
		memory: window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
		platform : window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
		mobile : window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown"`;


// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters
const listenerOptions = `passive: true`;

// https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpanelset_config
// tracking pageExits will flip the api_transport to 'sendBeacon'
exports.init = function (params = {}) {
	return `\n\nmixpanel.init("${params.token}", {
            cross_subdomain_cookie: true,
            debug: ${params.debug},
            persistence: "localStorage",
            api_transport: "XHR",
            ip: true,
            ignore_dnt: true,
            loaded: function (mp) {
		mp.register({${params.superProps ? standardProps : ""}});		
		
		${params.debug ? "mp.ezselector = querySelectorShadowDom.querySelectorAllDeep" : ""}

		try {
			EZTrackViews(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackExits(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackLinks(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackButtons(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {			
			EZTrackForms(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackProfiles(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackYoutube(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
		try {
			EZTrackAllClicks(mp);
		}
		catch (e) {
			${params.logErrors ? "console.error(e)" : ""}
		}
	}
}, "ez");\n\n`;
};


exports.trackViews = function (params) {
	const funcTitle = "EZTrackViews";
	if (params.pageViews) {
		return `function ${funcTitle}(mp) {
	mp.track('page view')
	${params.pageExits ? "mp.time_event('page exit')" : ""}
}\n\n`;

	} else {
		return noop(funcTitle);
	}
};


exports.trackExits = function (params) {
	const funcTitle = "EZTrackExits";
	if (params.pageExits) {
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

exports.trackLinks = function (params) {
	const funcTitle = "EZTrackLinks";
	if (params.linkClicks) {
		return `function ${funcTitle}(mp) {
		
	const links = [...${exports.getAllTags('a')}]
	for (const link of links) {
		link.addEventListener('click', (e) => {
			try {
				mp.track('link click', { ${exports.mapAttrs('link')} })
			}
			catch (e) {
				${params.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}})
	}

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

//links are also frequently .button or .btn
exports.trackButtons = function (params) {
	const funcTitle = "EZTrackButtons";
	if (params.buttonClicks) {
		return `function ${funcTitle}(mp) {
	
	const buttons = [...${exports.getAllTags('button')}]
	for (const button of buttons) {
		button.addEventListener('click', (e) => {
			try {
				mp.track('button click', { ${exports.mapAttrs('button')} })
			}
			catch (e) {
				${params.logErrors ? "console.error(e)" : ""}
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
	if (params.formSubmits) {
		return `function ${funcTitle}(mp) {

	const forms = [...${exports.getAllTags('form')}]	
	for (const form of forms) {		
		form.addEventListener('submit', (e) => {
			try {				
				mp.track('form submit', { ${exports.mapAttrs('form')} })
			}
			catch (e) {
				${params.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}})
	}

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};


exports.trackProfiles = function (params) {
	const funcTitle = "EZTrackProfiles";
	if (params.userProfiles) {
		return `function ${funcTitle}(mp) {

	mp.identify(mp.get_distinct_id())
	mp.people.set({"last page viewed":window.location.href, "language": window.navigator.language, "$name": "anonymous"});
	mp.people.increment("total # pages");
	mp.people.set_once({"$Created": new Date().toISOString() });

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};


// https://cssdeck.com/blog/css-snippets-how-to-add-a-cursor-to-all-clickable-elements/
exports.trackClicks = function (params) {
	const funcTitle = "EZTrackAllClicks";
	if (params.allClicks) {
		return `function ${funcTitle}(mp) {

	const allThings = [...${exports.getAllTags('*')}].filter(node => node.children.length === 0)${params.linkClicks ? ".filter(e => e.tagName !== 'A')" : ""}${params.buttonClicks ? ".filter(e => e.tagName !== 'BUTTON')" : ""}${params.formSubmits ? ".filter(e => e.tagName !== 'FORM')": ""}
	for (const thing of allThings) {
		thing.addEventListener('click', (e) => {
			try {
				mp.track('page click', { ${exports.mapAttrs('thing')} })
			}
			catch (e) {
				${params.logErrors ? "console.error(e)" : ""}
			}
		}, {${listenerOptions}, once: true})
	}
			
}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

// todo
// https://developers.google.com/youtube/iframe_api_reference
exports.trackYoutube = function (params) {
	const funcTitle = "EZTrackYoutube";
	if (params.youtube) {
		return `function ${funcTitle}(mp) {

}\n\n`;

	} else {
		return noop(funcTitle);
	}
};

exports.iffe = function (string) {
	return `(function () {
try {
${string}
}
catch (e) {}
})();`;
};

//helpers
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
	const queryParamValue = value?.toLowerCase()
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
// https://github.com/Georgegriff/query-selector-shadow-dom
exports.getAllTags = function selectsAllElementsOnPage(selector) {
	return `(() => {
		try { return querySelectorShadowDom.querySelectorAllDeep('${selector}')}
		catch (e) { return document.querySelectorAll('${selector}')}
	  })()`

};


// https://developer.mozilla.org/en-US/docs/Web/API/Element
exports.mapAttrs = function mapStandardAttributesFromElements(elementType) {
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
			`
			break;

		default:
			additionalFields += `
			tagName: "".concat('<', e.target.tagName ,'>'),
				text: e.target.innerText || e.target.value,			
			`
			break;
	}
	const standardFields = `
				classes : e.target.className.split(" ").filter(a => a),
				id: e.target.id`;
	
	const attributes = additionalFields.concat(standardFields).trim();

	return attributes;
};


function noop(funcName) {
	return `function ${funcName}(){()=>{}}\n\n`;
	// // https://gist.github.com/ak--47/4221ccaffcbbe1830bfd5e5c05dc09d3
	// return `function ${funcName}(){Function.prototype()};\n\n`
}