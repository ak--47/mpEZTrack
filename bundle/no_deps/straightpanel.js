import mixpanel from "mixpanel-browser";
import { querySelectorAllDeep } from "query-selector-shadow-dom";

const MIXPANEL_PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`;
console.log(`MIXPANEL SDK IS INJECTED IN THIS TAB\n\ncall\n\tmixpanel.init('you-token')\nto initialize the SDK with your mixpanel project, and then you can use any of the API methods in the docs\nhttps://github.com/mixpanel/mixpanel-js/blob/master/doc/readme.io/javascript-full-api-reference.md#mixpanel\n\n`);

window.mixpanel = mixpanel;
window.qsDeep = querySelectorAllDeep;