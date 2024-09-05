(function () {
	if (window.Shopify) {
		let boostVersions = {};
		for (let key in window) {
			if (key.includes("bcsf")) {
				boostVersions.V1 = "V1";
			}
			if (key.includes("BoostPFS")) {
				boostVersions.V2 = "V2";
			}
			if (key.includes("boostSDAppConfig") && key.includes("boostSD")) {
				boostVersions.V3 = "V3";
			}
			if (
				(key.includes("boostSD") && key.includes("boostSDData")) ||
				key.includes("boostWidgetIntegration")
			) {
				boostVersions.V3 = "Turbo";
			}
		}

		const shopifyObject = JSON.stringify(window.Shopify);
		boostVersions = JSON.stringify(boostVersions);
		window.postMessage({ type: "from_page", shopifyObject, boostVersions });
	}
})();
