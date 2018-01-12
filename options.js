// More to be added from  https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
var platform = ['Android', 'Linux', 'null', 'iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator'
, 'iPad Simulator', 'Macintosh' , 'MacIntel', 'MacPPC', 'Mac68K', 'Pike v7.6', 'Pike v7.8', 'BlackBerry',
'FreeBSD', 'FreeBSD i386', 'FreeBSD amd64', 'Linux', 'Linux aarch64', 'Windows'];

// List of Ad domains which needs to removed, more domains need to added
var blacklist = new Array;

//this will read file and call function to make the file content to array
function loadXMLDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            blacklist = this.responseText;
            localStorage['response'] = blacklist;
        }
    };
    xhttp.open("GET", chrome.extension.getURL("hosts"), true);
    xhttp.send();
}

//delay function
function delay() {
    // `delay` returns a promise
    return new Promise(function(resolve, reject) {
        // Only `delay` is able to resolve or reject the promise
        setTimeout(function() {
            resolve(42); // After 3 seconds, resolve the promise with value 42
        }, 3000);
    });
}

// splitting all text data into array "\n" is splitting data from each new line
//and saving each new line as each element*
function intoArray (lines) {
    return lines.split('\n');
}


// Selecting a random platform
var os =  platform[Math.floor(Math.random() * platform.length)];

// Changing the navigator.platform
var codeToInject = 'Object.defineProperty(navigator,"platform", { \
  get: function () { return "'+ os +'"; }, \
  set: function (a) {} \
 });';
var script = document.createElement('script');
script.appendChild(document.createTextNode(codeToInject));
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// Remove third party ad scripts in blacklist list
window.onload = function() {
    loadXMLDoc();
    blacklist = intoArray(localStorage['response']);
    var node = document.querySelectorAll('script');
    for(var i=0;i<node.length;i++){
        var parser = document.createElement('a');
        parser.href = node[i].src;
        //console.log(parser.hostname);
        //console.log(blacklist);
        //console.log(blacklist);
        if (blacklist.indexOf(parser.hostname) > -1) {
            console.log(parser.hostname);
            node[i].parentNode.removeChild(node[i]);
        }
    }
    console.log("List of ads blocked!! : ");
    node = document.querySelectorAll('script');
    for(var i=0;i<node.length;i++){
        console.log(node[i].src);
    }
}

// Code for spoofing height and width is disabled
var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


// Prevent Canvas Fingerprinting
var s = document.createElement('script');
s.src = chrome.extension.getURL('canvasing.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

// Prevent Battery API fingerprinting
var s = document.createElement('script');
s.src = chrome.extension.getURL('battery.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

// Reducing the time latency of perfomance.now()
// Prevention for sideChannel Attacks
var s = document.createElement('script');
s.src = chrome.extension.getURL('time.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
