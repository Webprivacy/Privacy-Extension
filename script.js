// Change the screen resolution
var height = Math.floor(Math.random() * 900) + 700;
var width = Math.floor(Math.random() * 800) + 700;
var availHeight = Math.floor(Math.random() * 800) + 600;  
screen = new function() { this.width = width; this.height = height; this.colorDepth = 24; this.availHeight=availHeight}