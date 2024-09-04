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
            <span class="title">${title}: </span>
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
	html += buildInfoToCopyHTML(boostCopyInfo);
	html += buildInfoToRedirectHTML(boostRedirectInfo);
	html += `</ul>`;

	return html;
};

const constructAdminRedirectsLinks = async (URL, shopWithoutDomain) => {
	try {
		const response = await fetch(URL);
		if (!response.ok) {
		}
		const data = await response.json();
		console.log(data);
		if (data.collection) {
			const adminRedirectURL = `https://admin.shopify.com/store/${shopWithoutDomain}/collections/${data.collection.id}`;
			return adminRedirectURL;
		}
		if (data.product) {
			const adminRedirectURL = `https://admin.shopify.com/store/${shopWithoutDomain}/products/${data.product.id}`;
			return adminRedirectURL;
		}
	} catch (error) {
		console.log("Failed while fetching JSON from URL: ", error);
	}
};

const constructURLLink = (location, id) => {
	try {
		const redirectLinks = {};
		const currentURL = new URL(location.href);
		const origin = currentURL.origin;
		const collectionsAll = origin + "/collections/all";
		redirectLinks.collections_all = collectionsAll;
		currentURL.searchParams.set("preview_theme_id", id);
		console.log(currentURL);

		redirectLinks.preview_link = currentURL.toString();

		currentURL.search = "";
		if (
			currentURL.pathname.includes("/products") ||
			currentURL.pathname.includes("/collections")
		) {
			const jsonInfoLink = currentURL.toString() + ".json";
			redirectLinks.current_page_JSON = jsonInfoLink;
		}
		console.log(redirectLinks);
		return redirectLinks;
	} catch (error) {
		console.log(error);
	}
};

const prepareInfo = async (data) => {
	const shopifyInfo = JSON.parse(data.shopifyInfo);
	const location = JSON.parse(data.location);
	const boostVersions = JSON.parse(data.boostVersions);

	let info = {
		shopify: { copy: [], redirect: [] },
		boost: { copy: [], redirect: [] },
	};
	for (let key in shopifyInfo) {
		if (key == "shop") {
			info.shopify.copy.push(`Shop->${shopifyInfo[key]}`);
		}
		if (key == "theme") {
			info.shopify.copy.push(`Theme ID->${shopifyInfo[key].id}`);
			info.shopify.copy.push(`Theme Name->${shopifyInfo[key].name}`);
		}
	}
	info.shopify.copy.push(
		`other->country:${shopifyInfo.country}, currency:${shopifyInfo.currency.active}`,
	);

	const redirectlinks = constructURLLink(location, shopifyInfo.theme.id);
	for (let key in redirectlinks) {
		if (key === "preview_link") {
			info.shopify.copy.push(`${key}->${redirectlinks[key]}`);
		} else {
			info.shopify.redirect.push(`${key}->${redirectlinks[key]}`);
		}
	}

	let versions = "";
	for (let key in boostVersions) {
		versions += "" + boostVersions[key] + ", ";
	}

	let shopWithoutDomain = shopifyInfo.shop.replace(".myshopify.com", "");

	if (Object.values(boostVersions).length != 0) {
		info.boost.copy.push(`Boost Versions Detected->${versions}`);
		info.boost.redirect.push(
			`Shopify Integration->https://admin.shopify.com/store/${shopWithoutDomain}/apps/product-filter-search/shopify-integration`,
		);
	}

	await constructAdminRedirectsLinks(
		redirectlinks.current_page_JSON,
		shopWithoutDomain,
	).then((response) => {
		console.log(response);
		if (response) {
			info.shopify.redirect.push(`This Page Admin->${response}`);
		}
	});

	return info;
};

window.addEventListener("load", async () => {
	const response = await chrome.storage.local.get("dataForPopup200");
	const data = response.dataForPopup200;
	console.log("got it in const data: ", data, !data.shopifyInfo);

	const shopifyInfoElm = document.querySelector("#popup");

	if (!data.shopifyInfo) {
		shopifyInfoElm.innerHTML =
			"<h1>Refresh the page on the Shopify Store Front</h1>";
		return;
	}

	const info = await prepareInfo(data);

	shopifyInfoElm.innerHTML = buildHTML(info);
	handleCopyToClipboard();
	handleRedirects();

	console.log("data: ", data);
});
