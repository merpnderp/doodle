var React = require('react');
var ReactDOM = require('react-dom');
var kMeans = require('kmeans-js');
var ndarray = require('ndarray');
var gaussianFilter = require('ndarray-gaussian-filter');

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('main')
);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();


img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //Edit
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
        K: 3
    });
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    let d = [], m = 0;
    for (var i = 0; i < data.length; i += 4) {
        d[m++] = [data[i], data[i + 1], data[i + 2]];
    }
    console.log(d);
    km.cluster(d);
    while (km.step()) {
        km.findClosestCentroids();
        km.moveCentroids();

        if (km.hasConverged()) break;
    }
    console.log('Finished in:', km.currentIteration, ' iterations');
    console.log(km.centroids);
    console.log(km.clusters);
//    for(var i = 0; i < km.clusters.length; i++){
//       km.centroids[i] = findTopColor(km.clusters[i]);
//    }
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var closest = 10^100000;
        var closestIndex = 0;
        for (var o = 0; o < km.centroids.length; o++) {
            var x = data[i] - km.centroids[o][0];
            var y = data[i + 1] - km.centroids[o][1];
            var z = data[i + 2] - km.centroids[o][2];
            var dist = (x * x + y * y + z * z ) ^ .5;
            if(dist < closest){
                closest = dist;
                closestIndex = o;
            }
        }
        data[i] = km.centroids[closestIndex][1];
        data[i + 1] = km.centroids[closestIndex][2];
        data[i + 2] = km.centroids[closestIndex][3];
    }
//Take into account his is RGBA and fix it-----------------------------
    var nd = ndarray(data, [imageData.width * 4, imageData.height]);
    console.log("image data");
    console.log(imageData.width * imageData.height);
    console.log(imageData.data.length);
    var filteredData = gaussianFilter(nd, 5);
    console.log(filteredData);

    var canvas4 = document.getElementById('canvas4');
    var ctx4 = canvas4.getContext('2d');

    ctx4.putImageData(new ImageData(filteredData.data, imageData.width, imageData.height), 0,0);
//    ctx4.putImageData(imageData, 0,0);


};

//img.src = '/images/rhino.jpg';
img.src = '/images/starynight.jpg';
