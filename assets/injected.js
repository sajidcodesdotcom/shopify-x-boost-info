(function() {
  let boostObjects = {};
  for (let key in window) {
    if (key.includes("boost")) {
      boostObjects[key] = window[key];
    }
  }

  console.log("running injected....");

  const shopifyObject = JSON.stringify(window.Shopify);
  boostObjects = JSON.stringify(boostObjects);

  window.postMessage({ type: "from_page", shopifyObject, boostObjects });
})();
