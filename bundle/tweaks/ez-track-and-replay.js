import mixpanel from "mixpanel-browser";
import { querySelectorAllDeep } from "query-selector-shadow-dom";

const PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`;

mixpanel.load = function (token) {
	mixpanel.init(token, {
		api_host: PROXY,
		debug: true,
		batch_flush_interval_ms: 0,
		ignore_dnt: true,
		persistence: "localStorage",
		loaded: function (mixpanel) {
			console.log('mixpanel SDK loaded\ncurrent distinct_id:', mixpanel.get_distinct_id());
		}

	});
};


console.log(`MIXPANEL SDK IS INJECTED IN THIS TAB\n\ncall\n\tmixpanel.load('you-token')\nto initialize the SDK with your mixpanel project, and then you can use any of the API methods in the docs\nhttps://github.com/mixpanel/mixpanel-js/blob/master/doc/readme.io/javascript-full-api-reference.md#mixpanel\n\n`);

window.mixpanel = mixpanel;
window.qsDeep = querySelectorAllDeep;