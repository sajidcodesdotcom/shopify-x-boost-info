let storedInfo = { empty: true };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("running", message);
  if (message.action == "sendShopifyInfo") {
    storedInfo = message.data;
    sendResponse("running from background.js");
  } else if (message.action == "fromPopup") {
    sendResponse(JSON.parse(storedInfo));
  }
  return true;
});
