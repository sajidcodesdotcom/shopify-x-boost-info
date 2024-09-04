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
	console.log("inside messageevent Listener", event.source, window);

	if (event.data.type && event.data.type === "from_page") {
		const shopifyObject = event.data.shopifyObject
			? event.data.shopifyObject
			: false;
		const boostVersions = event.data.boostVersions;
		const location = JSON.stringify(window.location);
		const parsedShopifyObject = JSON.parse(shopifyObject);
		console.log(JSON.parse(shopifyObject), location, boostVersions);

		if (parsedShopifyObject) {
			chrome.storage.local.set({
				dataForPopup200: {
					shopifyInfo: shopifyObject,
					location: location,
					boostVersions,
				},
			});
		}
	}
});
