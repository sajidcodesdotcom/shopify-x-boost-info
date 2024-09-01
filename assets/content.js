function injectScript(file) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(`assets/${file}`);
  // script.onload = () => {
  //   this.remove;
  // };
  //
  (document.head || document.documentElemen).appendChild(script);
}

window.addEventListener("load", () => {
  injectScript("injected.js");
});

console.log("inside content.jsk");
let hi = false;
window.addEventListener("message", (event) => {
  console.log("inside messageevent Listener");
  hi = true;
  if (event.source !== window) return;

  if (event.data.type && event.data.type === "from_page") {
    const shopifyObject = event.data.shopifyObject
      ? event.data.shopifyObject
      : false;
    const boostObjects = event.data.boostObjects;
    console.log(JSON.parse(shopifyObject));

    chrome.runtime.sendMessage(
      {
        action: "sendShopifyInfo",
        data: shopifyObject,
      },
      (response) => {
        console.log(response);
      },
    );
  }
});
