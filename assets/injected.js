(function () {
	let boostVersions = {};
	for (let key in window) {
		if (key.includes("bcsf")) {
			boostVersions.V1 = "V1";
		} else if (key.includes("BoostPFS")) {
			boostVersions.V2 = "V2";
		} else if (key.includes("boostSDAppConfig") && key.includes("boostSD")) {
			boostVersions.V3 = "V3";
		} else if (key.includes("boostSD") && key.includes("boostSDData")) {
			boostVersions.V3 = "Turbo";
		}
	}

	console.log("running injected....");

	const shopifyObject = JSON.stringify(window.Shopify);
	boostVersions = JSON.stringify(boostVersions);

	window.postMessage({ type: "from_page", shopifyObject, boostVersions });
})();
