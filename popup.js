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

window.onload = function() {
    // Slider Js
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = "Medium Security!";

    slider.oninput = function () {
        if(this.value<50) {
            output.innerHTML = "Low Security!";
        }
        else if(this.value == 50){
            output.innerHTML = "Medium Security!";
        }
        else{
            output.innerHTML = "High Security!";
        }
    }
}