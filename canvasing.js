document.orig_createelement = document.createElement;
document.createElement = function(x) {
    var ret_canvas = document.orig_createelement(x);
    console.log(x);
    //Here we can override canvas functions
    ret_canvas.orig_todataurl = ret_canvas.toDataURL;
    ret_canvas.toDataURL = function() {
        var randomID = Math.random().toString(10);
        var saved_style = ret_canvas.getContext('2d').fillStyle;
        var r = 0,
            g = 0,
            b = 0
            a = .01;
        ret_canvas.getContext('2d').fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        ret_canvas.getContext('2d').fillRect(0,0,ret_canvas.width,ret_canvas.height);
        ret_canvas.getContext('2d').fillStyle = saved_style;

        return ret_canvas.orig_todataurl();
    }

    ret_canvas.orig_getcontext = ret_canvas.getContext;
    ret_canvas.getContext = function(x) {
        var ret_ctx = ret_canvas.orig_getcontext(x);

        //Here we can override ctx functions
        ret_ctx.orig_getimagedata = ret_ctx.getImageData;
        ret_ctx.getImageData = function(w,x,y,z) {
            var imagedata = ret_ctx.orig_getimagedata(w,x,y,z);
            for (var i = 0; i < imagedata.data.length; i+=4) {
                //alpha blend the pixel to emulate ctx fill
                /*
                var r = 255*Math.random()|0,
                    g = 255*Math.random()|0,
                    b = 255*Math.random()|0

                imagedata[i] = r +  (imagedata[i] * .99);
                imagedata[i+1] = g +  (imagedata[i+1] * .99);
                imagedata[i+2] = b +  (imagedata[i+2] * .99);
                imagedata[i+3] = a +  (imagedata[i+3] * .99);
                */
                imagedata[i] = 250;
            }

            return imagedata;
        }

        return ret_ctx;
    }

    return ret_canvas;
}
