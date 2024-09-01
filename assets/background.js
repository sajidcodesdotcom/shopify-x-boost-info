let storedInfo = { empty: true };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("running", message);
  if (message.action == "sendShopifyInfo") {
    storedInfo = message;
    sendResponse("running from background.js");
  } else if (message.action == "fromPopup") {
    sendResponse(storedInfo);
  }
  return true;
});
