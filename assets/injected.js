(function () {
	let boostObjects = {};
	for (let key in window) {
		if (key.includes("bcsf")) {
			boostObjects.V1 = "V1";
		} else if (key.includes("BoostPFS")) {
			boostObjects.V2 = "V2";
		} else if (key.includes("boostSDAppConfig") && key.includes("boostSD")) {
			boostObjects.V3 = "V3";
		} else if (key.includes("boostSD") && key.includes("boostSDData")) {
			boostObjects.V3 = "Turbo";
		}
	}

	console.log("running injected....");

	const shopifyObject = JSON.stringify(window.Shopify);
	boostObjects = JSON.stringify(boostObjects);

	window.postMessage({ type: "from_page", shopifyObject, boostObjects });
})();
