function injectScript(file) {
	const script = document.createElement("script");
	script.src = chrome.runtime.getURL(`assets/${file}`);
	// script.onload = () => {
	//   this.remove;
	// };
	//
	(document.head || document.documentElement).appendChild(script);
}

window.addEventListener("load", () => {
	injectScript("injected.js");
});

console.log("inside content.jsk");

window.addEventListener("message", (event) => {
	console.log("inside messageevent Listener");
	hi = true;
	if (event.source !== window) return;

	if (event.data.type && event.data.type === "from_page") {
		const shopifyObject = event.data.shopifyObject
			? event.data.shopifyObject
			: false;
		const boostObjects = event.data.boostObjects;
		const location = JSON.stringify(window.location);
		console.log(JSON.parse(shopifyObject), location);

		chrome.storage.local.set({
			dataForPopup200: {
				shopifyInfo: shopifyObject,
				location: location,
			},
		});
	}
});
