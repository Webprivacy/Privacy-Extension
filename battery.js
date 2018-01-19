var bat = navigator.getBattery;
navigator.getBattery = function () {
    window._policy = true;
    function filter(battery, resolve) {
        // Proxy object is used to define custom behavior for fundamental operations
        var filtered = new Proxy(battery, {
            get: function (target, name) {
                // filter whatever we want
                if (name == "level") return 0;
                else if (name == "charging") return false;
                else if (name == "chargingTime") return 0;
                else if (name == "dischargingTime") return 0;
                else return target[name];
            }
        });
        // Returns the promise object 
        resolve(filtered);
    }

    var real_p = bat.apply(navigator);
    // Each promise has success handler and error handler
    return new Promise(function (resolve, reject) {
        real_p.then(function (battery) {
            filter(battery, resolve);
        });
    });
};