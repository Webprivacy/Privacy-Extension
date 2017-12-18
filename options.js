// More to be added from  https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
var platform = ['Android', 'Linux', 'null', 'iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator'
, 'iPad Simulator', 'Macintosh' , 'MacIntel', 'MacPPC', 'Mac68K', 'Pike v7.6', 'Pike v7.8', 'BlackBerry',
'FreeBSD', 'FreeBSD i386', 'FreeBSD amd64', 'Linux', 'Linux aarch64', 'Windows'];

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
