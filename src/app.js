var React = require('react');
var ReactDOM = require('react-dom');
var kMeans = require('kmeans-js');
const blur = require('./tracking').blur;

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('main')
);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();


img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i] += 80;
        data[i + 1] += 80;
        data[i + 2] += 80;
    }
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.putImageData(imageData, 0, 0);
    //Greyscale
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        //let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        //HDTV def for greyscale
        let brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
    }
    var canvas3 = document.getElementById('canvas3');
    var ctx3 = canvas3.getContext('2d');
    ctx3.putImageData(imageData, 0, 0);


    var km = new kMeans({
        K:4
    });
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    let d = [];
    d = RGBAToTrinary(data);
    km.cluster(d);
    while (km.step()) {
        km.findClosestCentroids();
        km.moveCentroids();

        if (km.hasConverged()) break;
    }
    console.log('Finished in:', km.currentIteration, ' iterations');
    console.log(km.centroids);
    console.log(km.clusters);

/*
    let pointClusters = [];
    d.map(function (p, i) {
        let min = Number.MAX_SAFE_INTEGER;
        let minIndex = -1;
        km.centroids.map(function (c, ci) {
            let dist = findDistance(p, c);
            if (dist < min) {
                min = dist;
                minIndex = ci;
            }
        })
        pointClusters[minIndex] ? pointClusters[minIndex].push(p) : pointClusters[minIndex] = [p];
    })

    pointClusters.map(function (cs, i) {
        var r = 0, g = 0, b = 0;
        cs.map(function (c, ci) {
            r += c[0];
            g += c[1];
            b += c[2];
        })
        r /= cs.length;
        g /= cs.length;
        b /= cs.length;
        km.centroids[i] = [r, g, b];
        console.log(km.centroids[i]);
    })
*/
    /*

     var newCentroids = [];

     for(var i = 0; i < pointClusters.length; i++){
     var subkm = new kMeans({
     K:5
     });
     subkm.cluster(pointClusters[i]);
     while(subkm.step()){
     subkm.findClosestCentroids();
     subkm.moveCentroids();
     if(subkm.hasConverged()) break;
     }
     console.log('Finished in:', subkm.currentIteration, ' iterations');
     console.log(subkm.centroids);
     console.log(subkm.clusters);
     //Now find largest cluster
     var largest = 0;
     var largestIndex = -1;
     for(var o = 0; o < subkm.clusters.length; o++){
     if(subkm.clusters[o].length > largest){
     largest = subkm.clusters[o].length;
     largestIndex = o;
     }
     }
     newCentroids.push(subkm.centroids[largestIndex]);
     }
     newCentroids.map(function(nc, i){ km.centroids[i] = nc;});
     */
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    data = blur(data, imageData.width, imageData.height, 50);
    for (let i = 0; i < data.length; i += 4) {
        var closest = Number.MAX_SAFE_INTEGER;
        var closestIndex = 0;
        for (var o = 0; o < km.centroids.length; o++) {
            var x = data[i] - km.centroids[o][0];
            var y = data[i + 1] - km.centroids[o][1];
            var z = data[i + 2] - km.centroids[o][2];
            var dist = (x * x + y * y + z * z ) ^ .5;
            if (dist < closest) {
                closest = dist;
                closestIndex = o;
            }
        }
        data[i] = km.centroids[closestIndex][0];
        data[i + 1] = km.centroids[closestIndex][1];
        data[i + 2] = km.centroids[closestIndex][2];
//        data[i+3] = 255;
    }
//Take into account his is RGBA and fix it-----------------------------
    data = new Uint8ClampedArray(blur(data, imageData.width, imageData.height, 2));
    data = new Uint8ClampedArray(data);
    var canvas4 = document.getElementById('canvas4');
    var ctx4 = canvas4.getContext('2d');
    ctx4.putImageData(new ImageData(data, imageData.width, imageData.height), 0, 0);
//    ctx4.putImageData(imageData, 0,0);


};
function findDistance(A, B) {
    var x = A[0] - B[0];
    var y = A[1] - B[1];
    var z = A[2] - B[2];
    return (x * x + y * y + z * z ) ^ .5;
}

function RGBAToTrinary(data) {
    var d = [], m = 0;
    for (let i = 0; i < data.length; i += 4) {
        d[m++] = [data[i], data[i + 1], data[i + 2]];
    }
    return d;
}
function RGBToTrinary(data) {
    var d = [], m = 0;
    for (let i = 0; i < data.length; i += 3) {
        d[m++] = [data[i], data[i + 1], data[i + 2]];
    }
    return d;
}

function rgb2hsv (r,g,b) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    //remove spaces from input RGB values, convert to int
    var r = parseInt( (''+r).replace(/\s/g,''),10 );
    var g = parseInt( (''+g).replace(/\s/g,''),10 );
    var b = parseInt( (''+b).replace(/\s/g,''),10 );

    if ( r==null || g==null || b==null ||
        isNaN(r) || isNaN(g)|| isNaN(b) ) {
        alert ('Please enter numeric RGB values!');
        return;
    }
    if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
        alert ('RGB values must be in the range 0 to 255.');
        return;
    }
    r=r/255; g=g/255; b=b/255;
    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));

    // Black-gray-white
    if (minRGB==maxRGB) {
        computedV = minRGB;
        return [0,0,computedV];
    }

    // Colors other than black-gray-white:
    var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
    var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
    computedH = 60*(h - d/(maxRGB - minRGB));
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    return [computedH,computedS,computedV];
}

//img.src = '/images/rhino.jpg';
img.src = '/images/starynight.jpg';
//img.src = '/images/Monet.jpg';
//img.src = '/images/rainbow.jpg';
