// Block all cookies except session cookies 
chrome.runtime.onInstalled.addListener(function() {
    chrome.contentSettings.cookies.set({
        'primaryPattern': "<all_urls>",
        'setting' : 'session_only'
    })
});

// Remove all the browsing data
function erase(){
  chrome.browsingData.remove({}, {
  		"appcache": true,
  		"cache": true,
  		"downloads": true,
  		"cookies": true,
  		"fileSystems": true,
  		"formData": true,
  		"history": true,
  		"indexedDB": true,
  		"localStorage": true,
  		"serverBoundCertificates": true,
  		"pluginData": true,
  		"passwords": true,
  		"webSQL": true
  })
}

// Detect browser window close event
chrome.windows.onRemoved.addListener(function(windowid) {
	alert("Thanks for Using Amrita Privacy badger!!");
	erase();
})

// Detect the tab closing event
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
	//We will need you in future
})