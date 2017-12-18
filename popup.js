var cookie, browserData;
    
$(document).ready(function() {
    $("#cookie").click(function() {
        chrome.storage.sync.set({'cookie': true}, function() {
          // Notify that we saved.
          //message('Settings saved');
        });
    });
    $("#browserdata").click(function() {
        chrome.storage.sync.set({'browserdata': true}, function() {
          // Notify that we saved.
          //message('Settings saved');
        });
    });
});

