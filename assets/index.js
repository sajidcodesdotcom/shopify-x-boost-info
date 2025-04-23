const handleCopyToClipboard = () => {
  const buttons = document.querySelectorAll("button.copy");
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const parent = e.target.closest("li");
      const inputEl = parent.querySelector("input");
      try {
        await navigator.clipboard.writeText(inputEl.value);
        // Store original content to restore
        const originalContent = button.innerHTML;
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          `;
        button.classList.add("copied");
        // Reset button after 1 second
        setTimeout(() => {
          button.innerHTML = originalContent;
          button.classList.remove("copied");
        }, 1000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });
};

const handleRedirects = () => {
  const links = document.querySelectorAll(".redirectLink");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = e.target.getAttribute("data-url");
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
            <span class="title">
              ${title}
            </span>
            <input type="text" value="${value}" readonly>
            <button class="copy">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
              </svg>
            </button>
          </li>`;
  }

  return html;
};

const buildInfoToRedirectHTML = (info) => {
  let html = "";
  for (let i of info) {
    const [title, value] = i.split("->");
    html += `<li class="redirect-item">
            <a class="redirectLink" data-url="${value}" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
              ${title}
            </a>
          </li>`;
  }

  return html;
};

const buildHTML = (info) => {
  const shopifyCopyInfo = info.shopify.copy;
  const shopifyRedirectInfo = info.shopify.redirect;
  const boostCopyInfo = info.boost.copy;
  const boostRedirectInfo = info.boost.redirect;
  
  // Start with Shopify info section
  let html = `<ul><h1>Shopify Info</h1>`;
  html += buildInfoToCopyHTML(shopifyCopyInfo);
  html += buildInfoToRedirectHTML(shopifyRedirectInfo);
  html += `</ul>`;
  
  // Only add Boost section if there's boost info available
  if (boostCopyInfo.length > 0 || boostRedirectInfo.length > 0) {
    html += `<div class="section-divider"></div>`;
    html += `<ul><h1>Boost App Info</h1>`;
    html += buildInfoToCopyHTML(boostCopyInfo);
    html += buildInfoToRedirectHTML(boostRedirectInfo);
    html += `</ul>`;
  }

  return html;
};

const constructAdminRedirectsLinks = async (URL, shopWithoutDomain) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
    }
    const data = await response.json();
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
    // redirectLinks.collections_all = collectionsAll;
    currentURL.searchParams.set("preview_theme_id", id);
    redirectLinks.preview_link = currentURL.toString();
    currentURL.search = "";
    // if (
    //   currentURL.pathname.includes("/products") ||
    //   currentURL.pathname.includes("/collections")
    // ) {
    //   const jsonInfoLink = currentURL.toString() + ".json";
    //   redirectLinks.current_page_JSON = jsonInfoLink;
    // }
    return redirectLinks;
  } catch (error) {
    console.log(error);
  }
}

const prepareInfo = async (data) => {
  const shopifyInfo = JSON.parse(data.shopifyInfo);
  const location = JSON.parse(data.location);
  const boostVersions = JSON.parse(data.boostVersions);
  const widgetIntegrationGeneralSettings = JSON.parse(
    data.widgetIntegrationGeneralSettings
  );

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
    `other->country:${shopifyInfo.country}, currency:${shopifyInfo.currency.active}`
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
    info.boost.copy.push(`App Version->${versions}`);
    info.boost.redirect.push(
      `Shopify Integration->https://admin.shopify.com/store/${shopWithoutDomain}/apps/product-filter-search/shopify-integration`
    );
  }

  if (boostVersions.V3) {
    info.boost.redirect.push(
      `Visual Editor->https://admin.shopify.com/store/${shopWithoutDomain}/apps/product-filter-search/theme-setting/${shopifyInfo.theme.id}/visual-editor`
    );
  }

  if (
    widgetIntegrationGeneralSettings &&
    widgetIntegrationGeneralSettings.templateId
  ) {
    info.boost.redirect.push(
      `Code Editor->https://admin.shopify.com/store/${shopWithoutDomain}/apps/product-filter-search/shopify-integration/code-editor/${widgetIntegrationGeneralSettings.templateId}`
    );
    info.boost.redirect.push(
      `Turbo Customizer->https://admin.shopify.com/store/${shopWithoutDomain}/apps/product-filter-search/shopify-integration-settings/${widgetIntegrationGeneralSettings.templateId}/visual-editor`
    );
  }

  if (redirectlinks.current_page_JSON) {
    await constructAdminRedirectsLinks(
      redirectlinks.current_page_JSON,
      shopWithoutDomain,
    ).then((response) => {
      if (response) {
        info.shopify.redirect.push(`This Page Admin->${response}`);
      }
    });
  }

  return info;
};

const main = async () => {
  try {
    const response = await chrome.storage.local.get("dataForPopup200");
    const data = response.dataForPopup200;

    const shopifyInfoElm = document.querySelector("#popup");

    if (!data || !data.shopifyInfo) {
      shopifyInfoElm.innerHTML = `
        <div class="alert">
          Please navigate to a Shopify storefront page and refresh to see information.
        </div>`;
      return;
    }

    const shopifyInfoParsed = JSON.parse(data.shopifyInfo);

    if (!shopifyInfoParsed || !shopifyInfoParsed.shop) {
      shopifyInfoElm.innerHTML = `
        <h1>Refresh the page on the Shopify Store Front</h1>`;
      return;
    }

    const info = await prepareInfo(data);

    shopifyInfoElm.innerHTML = buildHTML(info);
    handleCopyToClipboard();
    handleRedirects();
  } catch (error) {
    console.log(error);
    const shopifyInfoElm = document.querySelector("#popup");
    shopifyInfoElm.innerHTML = `
      <div class="alert">
        An error occurred. Please try refreshing the page.
      </div>`;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "pageLoaded") {
    setTimeout(() => {
      main();
      const alertElm = document.querySelector(".alert");
      if (alertElm) {
        alertElm.innerHTML = alertElm.textContent + " ✅";
      }
    }, 2000);
  }
});

window.addEventListener("load", () => {
  main();
});
