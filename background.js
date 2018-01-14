var level;
var tor;

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

// Get the content when there is change in level
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "low")
            sendResponse({
                msg: "goodbye!"
            });

        // Intializing the level of privacy needed.
        level = parseInt(request.greeting);
    }
);

// Disable flash for protecting against privacy
function blockFlash(block) {
    chrome.contentSettings.plugins.set({
        primaryPattern: '<all_urls>',
        resourceIdentifier: {
            id: 'adobe-flash-player'
        },
        setting: block ? 'block' : 'allow'
    });
}

// Receiving the storage using the message API
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
        level = storageChange.newValue;

        // Turn on the proxy only when the level is greater or equal to 50
        if(localStorage.level>=50 && (tor==false||typeof(tor)=="undefined")){
            toggleTorProxy(onConnectionChange);
            tor = true;
        }
        else if(tor==true && localStorage.level<50){
            toggleTorProxy(onConnectionChange);
            tor = false;
        }
    }
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
    if(level > 50) {
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

var item = ["Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
            "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)"];

var userAgent = item[Math.floor(Math.random()*item.length)];

var requestFilter = {
	urls: [
		"<all_urls>"
	]
};

// Change User agent
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    details.requestHeaders.push({name: "DNT", value: "1"});
    var headers = details.requestHeaders;
    for(var i = 0, l = headers.length; i < l; ++i) {
        if( headers[i].name == 'User-Agent' ) {
            break;
        }
    }
    if(i < headers.length) {
        headers[i].value = userAgent;
    }
    return {requestHeaders: headers};
}, requestFilter, ['requestHeaders','blocking']);

// Remove WebRTC leakage
chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: 'default_public_interface_only'
});
