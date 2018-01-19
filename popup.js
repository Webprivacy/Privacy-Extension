var cookie, browserData, level;

level = 50;
if(typeof(localStorage.level) != 'undefined') {
    level = localStorage.level;
}

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
        console.log(localStorage.level);
        domUpdation(localStorage.level);
    });
    document.getElementById('myRange').value = localStorage.level;
});

chrome.storage.sync.get(['lev'], function(items) {
    if(typeof lev != 'undefined') {
        alert(lev);
    }
});

function domUpdation(level) {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = "Medium Privacy!";
    if (level < 50) {
        output.innerHTML = "Low Privacy!";
    }
    else if(level == 50) {
        output.innerHTML = "Medium Privacy!";
    }
    else {
        output.innerHTML = "High Privacy!";
    }
}

window.onload = function() {
    // Slider Js
    domUpdation(localStorage.level);
}