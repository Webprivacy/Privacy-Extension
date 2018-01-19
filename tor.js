var url = "https://check.torproject.org", proxied = false;

// System default network setting
var system_network = { mode: 'system' };

// Tor network settings
var tor_network = {
  mode: 'fixed_servers',
  rules: { singleProxy: { scheme: 'socks5', host: '127.0.0.1', port: 9050 } }
};

// Check tor connection status when coming online
window.addEventListener('online', function() {
  //checkProxy(onProxyCheck);
});


// Update browser action icon when going offline
window.addEventListener('offline', function() {
  onConnectionChange(false);
});

// watch for proxy errors
//Update browser action icon and proxy settings on proxy error
chrome.proxy.onProxyError.addListener(function(details) {
  console.error('Proxy Error: ' + details.error);

  // disable proxy
  toggleTorProxy(onConnectionChange);
});

// Toggle chrome proxy settings between system and tor
function toggleTorProxy(cb) {
  var config = proxied ? system_network : tor_network;
  chrome.proxy.settings.set({ value: config, scope: 'regular' }, function() {
    proxied = !proxied;

    if(proxied){
    // Create a Notification
        var options = {
          type: "basic",
          title: "You are in Tor network!!",
          message: "Browsing may be slow, but tor is safe",
          iconUrl: "icon16.png"
        }

      chrome.notifications.create(options, callback);

      function callback(){
        console.log("Someone accessed the canvas!!");
      }
    }

    // From example https://developer.chrome.com/extensions/webRequest
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

// Update the browser action icon
function onConnectionChange(connected) {
  var stat  = connected ? "are" : "aren't"
    , image = connected ? 'connected.png' : 'not_connected.png'
    , title = "You "+ stat +" connected to the tor network";

  chrome.browserAction.setTitle({ title: title });
  chrome.browserAction.setIcon({ path: { 38: '' + image } });
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