// https://developer.mixpanel.com/docs/javascript-quickstart#installation-option-2-html
const SNIPPET = String.raw`(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);`;

// https://github.com/Georgegriff/query-selector-shadow-dom#readme
const SHADOW_DOM = String.raw`var qs=function(e){function t(e,t,u,a){void 0===a&&(a=null),e=function(e){function t(){r&&(u.length>0&&/^[~+>]$/.test(u[u.length-1])&&u.push(" "),u.push(r))}var n,r,l,o,u=[],a=[0],s=0,h=/(?:[^\\]|(?:^|[^\\])(?:\\\\)+)$/,i=/^\s+$/,c=[/\s+|\/\*|["'>~+[(]/g,/\s+|\/\*|["'[\]()]/g,/\s+|\/\*|["'[\]()]/g,null,/\*\//g];for(e=e.trim();;){if(r="",(l=c[a[a.length-1]]).lastIndex=s,!(n=l.exec(e))){r=e.substr(s),t();break}if((o=s)<(s=l.lastIndex)-n[0].length&&(r=e.substring(o,s-n[0].length)),a[a.length-1]<3){if(t(),"["===n[0])a.push(1);else if("("===n[0])a.push(2);else if(/^["']$/.test(n[0]))a.push(3),c[3]=new RegExp(n[0],"g");else if("/*"===n[0])a.push(4);else if(/^[\])]$/.test(n[0])&&a.length>0)a.pop();else if(/^(?:\s+|[~+>])$/.test(n[0])&&(u.length>0&&!i.test(u[u.length-1])&&0===a[a.length-1]&&u.push(" "),1===a[a.length-1]&&5===u.length&&"="===u[2].charAt(u[2].length-1)&&(u[4]=" "+u[4]),i.test(n[0])))continue;u.push(n[0])}else u[u.length-1]+=r,h.test(u[u.length-1])&&(4===a[a.length-1]&&(u.length<2||i.test(u[u.length-2])?u.pop():u[u.length-1]=" ",n[0]=""),a.pop()),u[u.length-1]+=n[0]}return u.join("").trim()}(e);var s=u.querySelector(e);return document.head.createShadowRoot||document.head.attachShadow?!t&&s?s:n(e,",").reduce(function(e,s){if(!t&&e)return e;var h=n(s.replace(/^\s+/g,"").replace(/\s*([>+~]+)\s*/g,"$1")," ").filter(function(e){return!!e}).map(function(e){return n(e,">")}),i=h.length-1,c=o(h[i][h[i].length-1],u,a),f=function(e,t,n){return function(o){for(var u=t,a=o,s=!1;a&&!r(a);){var h=!0;if(1===e[u].length)h=a.matches(e[u]);else{var i=a,c=[].concat(e[u]).reverse(),f=Array.isArray(c),g=0;for(c=f?c:c[Symbol.iterator]();;){var d;if(f){if(g>=c.length)break;d=c[g++]}else{if((g=c.next()).done)break;d=g.value}var p=d;if(!i||!i.matches(p)){h=!1;break}i=l(i,n)}}if(h&&0===u){s=!0;break}h&&u--,a=l(a,n)}return s}}(h,i,u);return t?e=e.concat(c.filter(f)):(e=c.find(f))||null},t?[]:null):t?u.querySelectorAll(e):s}function n(e,t){return e.match(/\\?.|^$/g).reduce(function(e,n){return'"'!==n||e.sQuote?"'"!==n||e.quote?e.quote||e.sQuote||n!==t?e.a[e.a.length-1]+=n:e.a.push(""):(e.sQuote^=1,e.a[e.a.length-1]+=n):(e.quote^=1,e.a[e.a.length-1]+=n),e},{a:[""]}).a}function r(e){return e.nodeType===Node.DOCUMENT_FRAGMENT_NODE||e.nodeType===Node.DOCUMENT_NODE}function l(e,t){var n=e.parentNode;return n&&n.host&&11===n.nodeType?n.host:n===t?null:n}function o(e,t,n){void 0===e&&(e=null),void 0===n&&(n=null);var r=[];if(n)r=n;else{var l=function e(t){for(var n=0;n<t.length;n++){var l=t[n];r.push(l),l.shadowRoot&&e(l.shadowRoot.querySelectorAll("*"))}};t.shadowRoot&&l(t.shadowRoot.querySelectorAll("*")),l(t.querySelectorAll("*"))}return e?r.filter(function(t){return t.matches(e)}):r}return e.collectAllElementsDeep=o,e.querySelectorAllDeep=function(e,n,r){return void 0===n&&(n=document),void 0===r&&(r=null),t(e,!0,n,r)},e.querySelectorDeep=function(e,n,r){return void 0===n&&(n=document),void 0===r&&(r=null),t(e,!1,n,r)},Object.defineProperty(e,"__esModule",{value:!0}),e}({});`;

// https://developer.mozilla.org/en-US/docs/Web/API/Window#properties
const SUPER_PROPS = String.raw`
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
		mobile : window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
		$source: "ezTrack"`;

const STANDARD_FIELDS = String.raw`
				classes : e.target.className.split(" ").filter(a => a),
				id: e.target.id`;

const LINK_SELECTORS = String.raw`a`;
const LINK_FIELDS = String.raw`
			url: e.target.href,
				text: e.target.innerHTML,`;

const BUTTON_SELECTORS = String.raw`button, .button, .btn`;
const BUTTON_FIELDS = String.raw`
			disabled: e.target.disabled,
				text: e.target.innerText,
				buttonName: e.target.name,`;

const FORM_SELECTORS = String.raw`form`;
const FORM_FIELDS = String.raw`
			numOfInputs: e.target.length,
				formName: e.target.name,
				formId: e.target.id,
				formMethod: e.target.method,
				formAction: e.target.action,
				formEncoding: e.target.encoding,`;

const ALL_SELECTOR = String.raw`*`;
const ANY_TAG_FIELDS = String.raw`
			tagName: "".concat('<', e.target.tagName ,'>'),
				text: e.target.innerText || e.target.value,`;

const YOUTUBE_SELECTOR = String.raw`iframe`;

module.exports = {
	SNIPPET,
	SHADOW_DOM,
	SUPER_PROPS,
	STANDARD_FIELDS,
	LINK_SELECTORS,
	LINK_FIELDS,
	BUTTON_SELECTORS,
	BUTTON_FIELDS,
	FORM_SELECTORS,
	FORM_FIELDS,
	ALL_SELECTOR,
	ANY_TAG_FIELDS,
	YOUTUBE_SELECTOR
};