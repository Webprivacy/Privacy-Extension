// Intialize the num_tabs with tab length
chrome.tabs.getAllInWindow(null, function (tabs) {
    //console.log("Initial tab count: " + tabs.length);
    num_tabs = tabs.length;
});

// Update the num_tabs when tab is created
chrome.tabs.onCreated.addListener(function (tab) {
    num_tabs++;
    //console.log("Tab created event caught. Open tabs #: " + num_tabs);
});

// Block all cookies except session cookies 
chrome.runtime.onInstalled.addListener(function () {
    chrome.contentSettings.cookies.set({
        'primaryPattern': "<all_urls>",
        'setting': 'session_only'
    })
});

// Remove all the browsing data
function erase() {
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
chrome.windows.onRemoved.addListener(function () {
    // We may need it in future
});

// Detect the tab closing event
chrome.tabs.onRemoved.addListener(function () {
    // Update the num_tabs
    num_tabs--;
    //console.log("Tab removed event caught. Open tabs #: " + num_tabs);
    if (num_tabs === 0) {
        // Erase all the browser data when num_tabs is 0
        erase();
        alert("You are safe with Amrita Privacy Badger!")
    }
});

// Chrome storage API
chrome.storage.sync.get("data", function (items) {

});
