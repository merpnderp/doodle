const React = require('react');
const ReactDOM = require('react-dom');
const blur = require('./tracking').blur;
const start = window.performance.now();
const RGBAToTrinary = require('./utils/rgbaToTrinary');
const applyCentroids = require('./utils/applyCentroidsToImageData');
const groupPixelsToCentroids = require('./utils/groupPixelsToCentroids');
const findAveragePixel = require('./utils/findAveragePixel');
const rgbToHSV = require('./utils/rgbPointToHSVPoint');
const greyscale = require('./utils/rgbaToGreyscale');
const kmCluster = require('./utils/kmCluster');

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('main')
);

const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let img = new Image();

const kmValue = 4;
const blurValue = 50;

img.onload = function () {
    //Draw original image
    //--------------
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let imageData;
    let data;
    //--------------

    //Greyscale
    //---------------
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = greyscale(imageData.data);
    var canvas3 = document.getElementById('canvas3');
    var ctx3 = canvas3.getContext('2d');
    ctx3.putImageData(imageData, 0, 0);
    //---------------

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // - get centroids.
    // - assign every pixel to a centroid.
    // - find average for cluster, creating a new centroid.
    // - assign all pixels to new centroid.
    // - repeat until no pixels move.
    //---------------
    let centroids = kmCluster(kmValue, RGBAToTrinary(data));
    let changed = true;
    let groups = groupPixelsToCentroids(centroids, data);//in trinary format
    while (changed) {
        groups.map(function (g, i) {
            centroids[i] = findAveragePixel(g);
        })
        let tGroup = groupPixelsToCentroids(centroids, data);
        let newGroups = tGroup.slice(0, tGroup.length);
        //See if groups have changed
        changed = false;
        newGroups.map(function (ng, i) {
            console.log(ng.length + " : " + groups[i].length);
            if (ng.length != groups[i].length) {
                changed = true;
            }
        })
        groups = newGroups.slice(0, newGroups.length);
    }
    console.log(groups);
    //---------------

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
    data = blur(data, imageData.width, imageData.height, blurValue);
    data = applyCentroids(data, centroids);

    //Take into account his is RGBA and fix it-----------------------------
    data = new Uint8ClampedArray(data);
    var canvas4 = document.getElementById('canvas4');
    var ctx4 = canvas4.getContext('2d');
    ctx4.putImageData(new ImageData(data, imageData.width, imageData.height), 0, 0);

    console.log("Finished in: " + (window.performance.now() - start) / 1000);
};


//img.src = '/images/rhino.jpg';
img.src = '/images/starynight.jpg';
//img.src = '/images/bedroom.jpg';
//img.src = '/images/olive.jpg';
//img.src = '/images/Monet.jpg';
//img.src = '/images/rainbow.jpg';
