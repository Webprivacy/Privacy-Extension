var level;

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

var requestFilter = {
	urls: [
		"<all_urls>"
	]
};

// Change User agent
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders;
    blockingResponse = {};
	if( !localStorage['user-agent'] ) {
		return;
	}
	for(var i = 0, l = headers.length; i < l; ++i) {
		if( headers[i].name == 'User-Agent' ) {
      headers[i].value = '>>> user agent string here <<<'; //have to list out the different user agents. 
      console.log(headers[i].value);
			break;
		}
    // If you want to modify other headers, this is the place to
    // do it. Either remove the 'break;' statement and add in more
    // conditionals or use a 'switch' statement on 'headers[i].name'
	}
    blockingResponse.requestHeaders = headers;
    return blockingResponse;
	// if(i < headers.length) {
	// 	headers[i].value = localStorage['user-agent'];
	// }
	// return {requestHeaders: headers};
}, {urls: [ "<all_urls>" ]},['requestHeaders','blocking']);

// Remove WebRTC leakage
chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: 'default_public_interface_only'
});

/*
// Set Tor proxy
var url = "https://check.torproject.org"
    , proxied = false;

// Normal Mode
var system_network = { mode: 'system' };

// Tor network mode
var tor_network = {
    mode: 'fixed_servers',
    rules: { singleProxy: { scheme: 'socks5', host: '127.0.0.1', port: 9050 } }
};

// Check tor connection status when coming online
window.addEventListener('online', function() {
    checkProxy(onProxyCheck);
});

// Check browser action icon when going offline
window.addEventListener('offline', function() {
    onConnectionChange(false);
});

// watch for proxy errors
// Update browser action icon and proxy settings on proxy error
chrome.proxy.onProxyError.addListener(function(details) {
    console.error('Proxy Error: ' + details.error);

    // disable proxy
    toggleTorProxy(onConnectionChange);
    console.log(
        'Proxy Error There was a problem connecting to your local tor proxy.  ' +
        'Make sure tor is running on localhost:9050.'
    );
});


// Toggle tor proxy settings on browser action icon click
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('click');
    toggleTorProxy(onConnectionChange);
});


// Toggle chrome proxy settings between system and tor
function toggleTorProxy(cb) {
    var config = proxied ? system_network : tor_network;
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function() {
        proxied = !proxied;

        // update header processing
        chrome.webRequest.onBeforeSendHeaders.removeListener(processHeaders);
        if(proxied) {
            // alter headers on outgoing requests
            chrome.webRequest.onBeforeSendHeaders.addListener(
                processHeaders,
                { urls: ['<all_urls>'] },
                ['blocking', 'requestHeaders']
            );
        }

        cb(proxied);
    });
}

// Check for a current tor connection using check.torproject.org
function checkProxy(cb) {
    var xhr = new XMLHttpRequest();
    // don't wait too long
    xhr.timeout = 5000;
    xhr.onerror = cb;
    xhr.ontimeout = cb;
    xhr.onload = function(e) {
        var resp = e.target.responseText;
        cb(null, (resp && resp.indexOf('Sorry') === -1));
    };
    xhr.open("GET", url);
    xhr.send();
}


// Handle proxy connection status check
function onProxyCheck(err, isTor) {
    if(err) {
        console.warn('Failed to check tor status at ' + url);
        return chrome.browserAction.setTitle({
            title: 'Unable to check tor status at ' + url
        });
    }
}

// Function strip headers from outgoing requests
function processHeaders(details) {
    for(var i = 0, l = details.requestHeaders.length; i < l; i++) {
        if(details.requestHeaders[i].name === 'Referer') {
            details.requestHeaders.splice(i, 1);
            break;
        }
    }
    return { requestHeaders: details.requestHeaders };
}

// check proxy status on boot
checkProxy(onProxyCheck);
*/