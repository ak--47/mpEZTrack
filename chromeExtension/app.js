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
		this.listeners();
		this.initView();
	},
	injectOnce: function () {
		this.port.postMessage("injectOnce");
	},
	listeners: function () {
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
			this.port.postMessage("injectAlwaysOn", token);
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
	}
};

// bootstrap 😱
app.init();