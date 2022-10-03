/* eslint-disable no-undef */
let primaryTabId = null;
let currentUser = { name: 'anonymous', email: 'unknown' };
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
					fetch('https://storage.googleapis.com/ez-track/v0.1b/eztrack.js', {cache: "no-store"})
						.then(res => res.text())
						.then((text) => {
							const script = text.concat(`if (!window.ezTrackInjected) mpEZTrack.init("${result.token}", {}, true); window.ezTrackInjected = true`);
							chrome.tabs.executeScript(details.tabId, {
								code: script,
								runAt: "document_idle"
							});
							chrome.browserAction.setIcon({ path: "iconActive.png" });
							changeFaviconAndTitle();
						});
					analyticsEvent(currentUser, "inject", {url: tab.url, projToken: result.token});
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
			analyticsEvent(currentUser, "inject once", {});
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
				analyticsEvent(currentUser, "auto-inject: on", {});
				port.postMessage({ "status": "persistent", tab });
			});
		}

		if (msg === "injectAlwaysOff") {
			primaryTabId = null;
			chrome.tabs.executeScript({
				code: String.raw`window.location.reload()`
			});
			chrome.browserAction.setIcon({ path: "icon.png" });
			analyticsEvent(currentUser, "auto-inject: off", {});
			port.postMessage({ "status": "off" });

		}

		if (msg === "openExtension") {
			analyticsEvent(currentUser, "open extension")
		}

	});
});

// ANALYTICS
async function getUser() {
	let url = `https://www.google.com/`;
	let response = await fetch(url);
	let html = await response.text();

	try {
		let userString = html.split('aria-label="Google Account: ').slice(-1)[0].split("href=")[0];
		let name = userString.split("&#10;")[0].trim();
		let email = userString.split("&#10;")[1].replace("(", "").replace(")", "").replace("'", "").replace('"', '').trim();
		user = { name, email };
	} catch {
		user = { name: 'anonymous', email: 'unknown' };
	}
	return user;
}

async function analytics(user = currentUser) {
	await analyticsEvent(user, "online");
	if (user.name !== "anonymous") await analyticsUser(user);
}

async function analyticsEvent(user = currentUser, eventName = "ping", props = {}) {
	const endpoint = `https://api.mixpanel.com/track?ip=1&verbose=0`;
	const data = {
		event: eventName,
		"properties": {
			"token": "d9445d42d4cb3bfeacdbcb0d3b10b633",
			"distinct_id": user.name,
			...props
		}
	};

	const options = {
		method: 'POST',
		headers: { accept: 'text/plain', 'content-type': 'application/json' },
		body: JSON.stringify([data])
	};

	const res = await fetch(endpoint, options);
	return res


}

async function analyticsUser(user = { name: 'anonymous', email: 'unknown' }, props = {}, directive = "$set") {
	const endpoint = `https://api.mixpanel.com/engage?ip=1&verbose=0`;
	const data = {
		$token: 'd9445d42d4cb3bfeacdbcb0d3b10b633',
		$distinct_id: user.name,
		[directive]: {
			...props
		}
	};

	if (directive === "$set") {
		data.$set.$email = user.email;
		data.$set.$name = user.name;
	}

	const options = {
		method: 'POST',
		headers: { accept: 'text/plain', 'content-type': 'application/json' },
		body: JSON.stringify([data])
	};

	const res = await fetch(endpoint, options);
	return res

}

getUser().then((user) => {
	currentUser = user;
	analytics(user);
});