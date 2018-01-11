var cookie, browserData, level;

level = 50;
if(typeof(localStorage.level) != 'undefined') {
    level = localStorage.level;
}

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

// Sending the changed the range data to background.js
$(document).ready(function(){
    $("[type=range]").change(function(){
        /*
        chrome.runtime.sendMessage({
                greeting: document.getElementById('myRange').value
            },
            function(response) {
                alert(response.msg);
            }
        );
        */
        // Storing the level when there is change
        chrome.storage.sync.set({'lev': document.getElementById('myRange').value }, function() {
            console.log('Level Changed!');
        });
        localStorage.level = document.getElementById('myRange').value;
    });
    document.getElementById('myRange').value = level;
});

chrome.storage.sync.get(['lev'], function(items) {
    if(typeof lev != 'undefined') {
        alert(lev);
    }
});

window.onload = function() {
    // Slider Js
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = "Medium Privacy!";

    slider.oninput = function () {
        if(this.value<50) {
            output.innerHTML = "Low Privacy!";
        }
        else if(this.value == 50){
            output.innerHTML = "Medium Privacy!";
        }
        else{
            output.innerHTML = "High Privacy!";
        }
    }
}