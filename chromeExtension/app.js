const app = {
	dom: {},
	query: document.querySelector.bind(document),
	port: chrome.extension.connect({ name: "eztrack" }),
	init: function () {
		this.dom.injectButton = this.query('#inject');
		this.dom.tokenEntered = this.query('#token');
		this.dom.saveButton = this.query('#save');
		this.dom.resetButton = this.query('#reset');
		this.dom.statusTextOn = this.query('#statusTextOn');
		this.dom.statusTextOff = this.query('#statusTextOff');
		this.dom.tempActive = this.query('#tempActive');
		this.dom.showToken = this.query('#showUserToken');
		this.dom.lastTokenText = this.query('#lastTokenText');
		this.dom.lastToken = this.query('#lastToken');
		this.dom.pageTitle = this.query('#pageTitle');
		this.listeners();
		this.initView();
	},
	injectOnce: function () {
		this.port.postMessage("injectOnce");
	},
	listeners: function () {

		// BACKGROUND.js
		this.port.onMessage.addListener((msg) => {
			if (msg?.status === 'persistent') {
				this.dom.pageTitle.textContent = msg.tab.title;
				chrome.storage.local.set({ "lastPage": msg.tab.title });
			}
		});

		// INJECT
		this.dom.injectButton.addEventListener('click', (ev) => {
			this.injectOnce();
			this.dom.injectButton.setAttribute('disabled', '');
			this.dom.injectButton.classList.add('hidden');
			this.dom.tempActive.classList.remove('hidden');
		});

		// SAVE
		this.dom.saveButton.addEventListener('click', (ev) => {
			this.save();
			this.port.postMessage("injectAlwaysOn");

		});

		// RESET
		this.dom.resetButton.addEventListener('click', (ev) => {
			this.reset(this.dom.tokenEntered.value);
			this.port.postMessage("injectAlwaysOff");
		});


	},
	// UI states
	save: function () {
		chrome.storage.local.set({ "token": this.dom.tokenEntered.value });
		chrome.storage.local.set({ "lastToken": null });
		this.dom.showToken.textContent = this.dom.tokenEntered.value;
		this.dom.saveButton.setAttribute('disabled', '');
		this.dom.resetButton.removeAttribute('disabled');
		this.dom.statusTextOn.classList.remove('hidden');
		this.dom.statusTextOff.classList.add('hidden');
		this.dom.lastTokenText.classList.add('hidden');
	},
	reset: function (foundToken = false) {
		if (foundToken) {
			this.dom.lastToken.textContent = foundToken;
			chrome.storage.local.set({ "lastToken": foundToken });
			this.dom.statusTextOff.classList.remove('hidden');
			this.dom.lastTokenText.classList.remove('hidden');
		}

		chrome.storage.local.set({ "token": null });
		chrome.storage.local.set({ "lastPage": null });
		this.dom.showToken.textContent = "";
		this.dom.resetButton.setAttribute('disabled', '');
		this.dom.saveButton.removeAttribute('disabled');
		this.dom.statusTextOn.classList.add('hidden');
	},
	initView: function () {
		chrome.storage.local.get(['token'], (result) => {
			if (result.token) {
				this.dom.tokenEntered.value = result.token;
				this.save();
			}
			else {
				chrome.storage.local.get(['lastToken'], (result) => {
					if (result.lastToken) {
						this.dom.lastToken.textContent = result.lastToken;
						this.dom.tokenEntered.value = result.lastToken;
						this.reset(result.lastToken);
					}

					else {
						this.reset(false);
					}
				});

			}
		});

		chrome.storage.local.get(['lastPage'], (result) => {
			if (result.lastPage) {
				this.dom.pageTitle.textContent = result.lastPage;
			}
		});
	}
};

// bootstrap 😱
app.init();