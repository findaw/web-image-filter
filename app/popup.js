// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");


chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});
  

// Using programmatic injection allows for user-invoked content scripts,
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });
  
// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    // let changeColor = document.getElementById("changeColor");

    chrome.storage.sync.get("color", ({ color }) => {
        
        prevColor = changeColor.style.backgroundColor
        console.log(prevColor)
        document.body.style.backgroundColor = color;
        chrome.storage.sync.set({"color": prevColor});
    });
}