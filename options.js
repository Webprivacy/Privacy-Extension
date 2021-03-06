// List of Ad domains which needs to removed, more domains need to added
var level;
var blacklist = new Array;

// Update level from localStorage
level = localStorage['level'];

// Make the level change in content script
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
        localStorage['level'] = level;
    }
});


// Code for spoofing height and width is disabled
var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


if(localStorage['level'] > 49){
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



  // More to be added from  https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
  var platform = ['win32'];
  // Selecting a random platform
  //var os =  platform[Math.floor(Math.random() * platform.length)];

  // Changing the navigator.platform
  var codeToInject = 'Object.defineProperty(navigator,"platform", { \
    get: function () { return "Win32"; }, \
    set: function (a) {} \
   });';

  var nav;
  codeToInject += 'Object.defineProperty(navigator,"userAgent", { \
     get: function () { return "Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0"; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"appCodeName", { \
     get: function () { return "Mozilla"; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"appName", { \
     get: function () { return "Netscape"; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"appVersion", { \
     get: function () { return "5.0 (Windows)"; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"cookieEnabled", { \
     get: function () { return true; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"deviceMemory", { \
     get: function () { return '+ nav +'; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"doNotTrack", { \
     get: function () { return "unspecified"; }, \
     set: function (a) {} \
    });';
  codeToInject += 'Object.defineProperty(navigator,"mimeTypes", { \
     get: function () { return '+ nav +'; }, \
     set: function (a) {} \
    });';
  codeToInject += "Object.defineProperty(navigator, 'plugins', { \
      get: function() { return {};},\
      set: function (a) {} \
    });";
  codeToInject += 'Object.defineProperty(navigator,"language", { \
     get: function () { return "en-US"; }, \
     set: function (a) {} \
    });';

  var script = document.createElement('script');
  script.appendChild(document.createTextNode(codeToInject));
  (document.head || document.documentElement).appendChild(script);

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

}