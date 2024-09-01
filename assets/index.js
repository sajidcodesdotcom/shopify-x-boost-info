const handleCopyToClipboard = () => {
  const buttons = document.querySelectorAll("button");
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
    const [title, value] = i.split(":");
    html += `<li>
            <span class="title">${title}:</span>
            <input type="text" value="${value}" readonly>
            <button class="copy">Copy</button></li>`;
  }
  html += `<ul>`;

  return html;
};

window.addEventListener("load", () => {
  chrome.runtime.sendMessage({ action: "fromPopup" }, (response) => {
    if (!response) {
      shopifyInfoElm.innerHTML = "Refresh the page on the Shopify Store Front";
      return;
    }

    const shopifyInfo = JSON.parse(response.shopifyInfo);
    const shopifyInfoElm = document.querySelector(".shopify-info");

    let info = [];
    for (let i in shopifyInfo) {
      if (i == "shop") {
        info.push(`Shop: ${shopifyInfo[i]}`);
      }
      if (i == "theme") {
        info.push(`Theme ID: ${shopifyInfo[i].id}`);
        info.push(`Theme Name: ${shopifyInfo[i].name}`);
      }
    }

    shopifyInfoElm.innerHTML = buildShopifyInfo(info);
    handleCopyToClipboard();

    console.log("data: ", response);
  });
});
