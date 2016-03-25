const kMeans = require('kmeans-js');

let km;

module.exports = function(kValue, trinaryData){
    km = new kMeans({
        K: kValue
    });
    km.cluster(trinaryData);
    while (km.step()) {
        km.findClosestCentroids();
        km.moveCentroids();

        if (km.hasConverged()) break;
    }
    return km.centroids;
}

