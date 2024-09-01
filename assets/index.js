window.addEventListener("load", () => {
  chrome.runtime.sendMessage({ action: "fromPopup" }, (response) => {
    // const data = JSON.parse(response);
    console.log("data: ", response);
  });
});
