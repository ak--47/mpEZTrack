// this is the background code...

// // listen for our browerAction to be clicked
// chrome.browserAction.onClicked.addListener(function (tab) {
// 	// for the current tab, inject the "inject.js" file & execute it
// 	chrome.tabs.executeScript(tab.ib, {
// 		file: 'injectOnce.js'
// 	});
// });


// chrome.runtime.onMessage.addListener(
// 	function (message, callback) {
// 		if (message == "injectOnce") {
// 			chrome.tabs.executeScript({
// 				file: 'injectOnce.js'
// 			});
// 		}
// 	});



chrome.webNavigation.onCompleted.addListener(function (details) {

	chrome.storage.local.get(['token'], function (result) {
		if (result.token) {
			fetch('https://storage.googleapis.com/ez-track/v0.1b/eztrack.js')
				.then(res => res.text())
				.then((text) => {
					const script = text.concat(`if (mpEZTrack.token === "") mpEZTrack.init("${result.token}", {}, true);`);
					chrome.tabs.executeScript(details.tabId, {
						code: script,
						runAt: "document_idle"
					});
					chrome.browserAction.setIcon({ path: "iconActive.png" });
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
			port.postMessage("complete");
		}


		if (msg === "injectAlwaysOn") {
			chrome.tabs.executeScript({
				code: String.raw`window.location.reload()`
			});
			chrome.browserAction.setIcon({ path: "iconActive.png" });
			port.postMessage("complete");

		}

		if (msg === "injectAlwaysOff") {
			chrome.tabs.executeScript({
				code: String.raw`window.location.reload()`
			});
			chrome.browserAction.setIcon({ path: "icon.png" });
			port.postMessage("complete");

		}



	});
});