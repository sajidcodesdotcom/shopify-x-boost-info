// Changing approach to use chrome.storage.local instead of backgourrnd service to send data to popup.

// let storedInfo = { empty: true };
//
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("running", message);
//   if (message.action == "sendShopifyInfo") {
//     storedInfo = message;
//     sendResponse("running from background.js");
//   } else if (message.action == "fromPopup") {
//     sendResponse(storedInfo);
//   }
//   return true;
// });
//
//

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	// Check if the page has started loading
	if (changeInfo.status === "loading" && tab.active) {
		// Send a message to the popup that the page has started loading
		chrome.runtime.sendMessage({ action: "pageStartedLoading" });
	}
	// Check if the page has finished loading
	if (changeInfo.status === "complete" && tab.active) {
		// Send a message to the popup that the page is fully loaded
		chrome.runtime.sendMessage({ action: "pageLoaded" });
	}

	return true;
});
