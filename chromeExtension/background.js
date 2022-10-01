/* eslint-disable no-undef */
let primaryTabId = null;
const queryOptions = { active: true, lastFocusedWindow: true };
const cautionEmoji = String.raw`PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDx0ZXh0IHk9IjMyIiBmb250LXNpemU9IjMyIj7imqDvuI88L3RleHQ+Cjwvc3ZnPg==`;

function changeFaviconAndTitle() {
	setTimeout(() => {
		chrome.tabs.executeScript({
			code: `
			setTimeout(()=>{
				[...document.querySelectorAll("link[rel~='icon']")].forEach(( node )=> {node.remove()});
				var link = document.createElement('link');
				link.rel = 'icon';
				link.href = 'data:image/svg+xml;base64,${cautionEmoji}';
				document.getElementsByTagName('head')[0].appendChild(link);													
			}, 500);
			document.title = "mpEZTracked!!!"
			`
		});
	}, 0);
}


chrome.webNavigation.onCompleted.addListener(function (details) {
	chrome.tabs.query(queryOptions, ([tab]) => {
		if (tab.id === details.tabId && tab.id === primaryTabId) {
			chrome.storage.local.get(['token'], function (result) {
				if (result.token) {
					fetch('https://storage.googleapis.com/ez-track/v0.1b/eztrack.js')
						.then(res => res.text())
						.then((text) => {
							const script = text.concat(`if (!window.ezTrackInjected) mpEZTrack.init("${result.token}", {}, "spa"); window.ezTrackInjected = true`);
							chrome.tabs.executeScript(details.tabId, {
								code: script,
								runAt: "document_idle"
							});
							chrome.browserAction.setIcon({ path: "iconActive.png" });
							changeFaviconAndTitle();
						});
				}
			});
		}
	});

}, { once: true });


chrome.extension.onConnect.addListener(function (port) {
	console.log("Connected .....");
	port.onMessage.addListener(function (msg) {
		if (msg === "injectOnce") {
			chrome.tabs.executeScript({
				file: 'injectOnce.js'
			});
			port.postMessage({ "status": "done" });
		}


		if (msg === "injectAlwaysOn") {
			chrome.tabs.query(queryOptions, ([tab]) => {
				primaryTabId = tab.id;
				chrome.tabs.executeScript({
					code: String.raw`window.location.reload()`
				});

				changeFaviconAndTitle();

				chrome.browserAction.setIcon({ path: "iconActive.png" });
				port.postMessage({ "status": "persistent", tab });
			});
		}

		if (msg === "injectAlwaysOff") {
			primaryTabId = null;
			chrome.tabs.executeScript({
				code: String.raw`window.location.reload()`
			});
			chrome.browserAction.setIcon({ path: "icon.png" });
			port.postMessage({ "status": "off" });

		}



	});
});