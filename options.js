// More to be added from  https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
var platform = ['Android', 'Linux', 'null', 'iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator'
, 'iPad Simulator', 'Macintosh' , 'MacIntel', 'MacPPC', 'Mac68K', 'Pike v7.6', 'Pike v7.8', 'BlackBerry',
'FreeBSD', 'FreeBSD i386', 'FreeBSD amd64', 'Linux', 'Linux aarch64', 'Windows'];

// List of Ad domains which needs to removed, more domains need to added
var blacklist = ['securepubads.g.doubleclick.net', 'pagead2.googlesyndication.com'];

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
    var node = document.querySelector('script');
    var parser = document.createElement('a');
    parser.href = node.src;
    if (blacklist.indexOf(parser.hostname) > -1) {
        node.parentNode.removeChild(node);
    }
}