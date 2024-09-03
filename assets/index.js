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

const handleRedirects = () => {
	const links = document.querySelectorAll(".redirectLink");
	links.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const url = e.target.getAttribute("data-url");
			console.log("clicked: ", url);
			if (url) {
				chrome.tabs.create({ url: url });
			}
		});
	});
};

const buildInfoToCopyHTML = (info) => {
	let html = "";
	for (let i of info) {
		const [title, value] = i.split("->");
		html += `<li>
            <span class="title">${title}:</span>
            <input type="text" value="${value}" readonly>
            <button class="copy">Copy</button></li>`;
	}

	return html;
};

const buildInfoToRedirectHTML = (info) => {
	let html = "";
	for (let i of info) {
		const [title, value] = i.split("->");
		html += `<li>
            <span class="title">${title}: &#128279;</span>
            <a class="redirectLink" data-url=${value} href="#">${value}</a>
            </li>`;
	}

	return html;
};

const buildHTML = (info) => {
	const shopifyCopyInfo = info.shopify.copy;
	const shopifyRedirectInfo = info.shopify.redirect;
	const boostCopyInfo = info.boost.copy;
	const boostRedirectInfo = info.boost.redirect;
	let html = `<ul> <h1>Shopify Info:</h1>`;
	html += buildInfoToCopyHTML(shopifyCopyInfo);
	html += buildInfoToRedirectHTML(shopifyRedirectInfo);
	html += `</ul>`;

	return html;
};

const constructPreviewLink = (location, id) => {
	try {
		const currentURL = new URL(location.href);
		currentURL.searchParams.set("preview_theme_id", id);
		const updatedURL = currentURL.toString();
		return updatedURL;
	} catch (error) {
		console.log(error);
	}
};

const constructCollectionsAllLink = (location) => {
	const currentURL = new URL(location.href);
	const collectionsAll = currentURL.origin + "/collections/all";
	return collectionsAll;
};

const prepareInfo = (data) => {
	const shopifyInfo = JSON.parse(data.shopifyInfo);
	const location = JSON.parse(data.location);

	let info = {
		shopify: { copy: [], redirect: [] },
		boost: { copy: [], redirect: [] },
	};
	for (let i in shopifyInfo) {
		if (i == "shop") {
			info.shopify.copy.push(`Shop-> ${shopifyInfo[i]}`);
		}
		if (i == "theme") {
			info.shopify.copy.push(`Theme ID-> ${shopifyInfo[i].id}`);
			info.shopify.copy.push(`Theme Name-> ${shopifyInfo[i].name}`);
			info.shopify.copy.push(
				`Preview Link-> ${constructPreviewLink(location, shopifyInfo[i].id)}`,
			);
		}
	}
	info.shopify.redirect.push(
		`Collections/all-> ${constructCollectionsAllLink(location)}`,
	);
	return info;
};

window.addEventListener("load", async () => {
	const response = await chrome.storage.local.get("dataForPopup200");
	const data = response.dataForPopup200;
	console.log("got it in const data: ", data, !data.shopifyInfo);

	const shopifyInfoElm = document.querySelector(".shopify-info");

	if (!data.shopifyInfo) {
		shopifyInfoElm.innerHTML = "Refresh the page on the Shopify Store Front";
		return;
	}

	const info = prepareInfo(data);

	shopifyInfoElm.innerHTML = buildHTML(info);
	handleCopyToClipboard();
	handleRedirects();

	console.log("data: ", data);
});
