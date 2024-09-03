const handleCopyToClipboard = () => {
	const buttons = document.querySelectorAll("button.copy");
	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const parent = e.target.parentElement;
			console.log(parent);
			parent.querySelector("input").select();
			document.execCommand("copy");
			button.textContent = "Copied!";
			button.style.background = "#0c66e4";
			button.style.color = "white";
		});
	});
};

const buildShopifyInfo = (info) => {
	let html = `<h1>Shopify Info:</h1><ul>`;
	for (let i of info) {
		const [title, value] = i.split("->");
		html += `<li>
            <span class="title">${title}:</span>
            <input type="text" value="${value}" readonly>
            <button class="copy">Copy</button></li>`;
	}
	html += `<ul>`;

	return html;
};

const constructPreviewLink = (location, id) => {
	try {
		const currentURL = new URL(location.href);
		currentURL.searchParams.set("preview_theme_id", id);
		const updatedURL = currentURL.toString();
		console.log(location, currentURL, updatedURL);

		return updatedURL;
	} catch (error) {
		console.log(error);
	}
};

window.addEventListener("load", async () => {
	const response = await chrome.storage.local.get("dataForPopup200");
	const data = response.dataForPopup200;
	console.log("got it in const data: ", JSON.Parse(data), !data.shopifyInfo);

	const shopifyInfoElm = document.querySelector(".shopify-info");

	if (!data.shopifyInfo) {
		shopifyInfoElm.innerHTML = "Refresh the page on the Shopify Store Front";
		return;
	}

	const shopifyInfo = JSON.parse(data.shopifyInfo);
	const location = JSON.parse(data.location);

	let info = [];
	for (let i in shopifyInfo) {
		if (i == "shop") {
			info.push(`Shop-> ${shopifyInfo[i]}`);
		}
		if (i == "theme") {
			info.push(`Theme ID-> ${shopifyInfo[i].id}`);
			info.push(`Theme Name-> ${shopifyInfo[i].name}`);
			info.push(
				`Preview Link-> ${constructPreviewLink(location, shopifyInfo[i].id)}`,
			);
		}
	}

	shopifyInfoElm.innerHTML = buildShopifyInfo(info);
	handleCopyToClipboard();

	console.log("data: ", data);
});
