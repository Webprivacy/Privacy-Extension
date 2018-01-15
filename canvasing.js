/*
 Prevention for canvas Fingerprinting
*/
// Copy the function of document.createElement to other function so that the data is not lost
document.orig_createelement = document.createElement;
//Redefine function createElement so that we can change toDataURL
document.createElement = function(x) {
    var ret_canvas = document.orig_createelement(x);

    // Copy the function toDataURL so that data is not lost
    ret_canvas.orig_todataurl = ret_canvas.toDataURL;
    // Redefine function toDataURL to add noise
    ret_canvas.toDataURL = function() {
        var randomID = Math.random().toString(10);
        var saved_style = ret_canvas.getContext('2d').fillStyle;
        var r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0
            a = .01;
        ret_canvas.getContext('2d').fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        ret_canvas.getContext('2d').fillRect(0,0,ret_canvas.width,ret_canvas.height);
        ret_canvas.getContext('2d').fillStyle = saved_style;

        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAADICAYAAACwGnoBAAAH6ElEQVR4nO3ZMQEAAAiAMPuXxhh6bAn4mQAAAAAAAACA5joAAAAAAAAAAD4w0AEAAAAAAAAgAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAACoDHQAAAAAAAAAqAx0AAAAAAAAAKgMdAAAAAAAAAKpaV/0C3qz3zKIAAAAASUVORK5CYII=";
        //return ret_canvas.orig_todataurl();
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
                var r = 255*Math.random()|0,
                    g = 255*Math.random()|0,
                    b = 255*Math.random()|0

                imagedata[i] = r +  (imagedata[i] * .99);
                imagedata[i+1] = g +  (imagedata[i+1] * .99);
                imagedata[i+2] = b +  (imagedata[i+2] * .99);
                imagedata[i+3] = a +  (imagedata[i+3] * .99);
                //imagedata[i] = 255;
            }
            return imagedata;
        }
        return ret_ctx;
    }

    return ret_canvas;
}
