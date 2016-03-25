const findDistance = require('./findDistanceBetweenPoints');
let dist, o, i, closest, closestIndex;

module.exports = function (centroids, data) {
    let groups = [];

    for (i = 0; i < centroids.length; i++) {
        groups[i] = [];
    }

    for (i = 0; i < data.length; i += 4) {
        closest = Number.MAX_SAFE_INTEGER;
        closestIndex = 0;
        for (o = 0; o < centroids.length; o++) {
            dist = findDistance([data[i], data[i + 1], data[i + 2]], [centroids[o][0], centroids[o][1], centroids[o][2]]);
            if (dist < closest) {
                closest = dist;
                closestIndex = o;
            }
        }
        groups[closestIndex].push([data[i], data[i + 1], data[i + 2], data[i + 3]])
//        data[i] = centroids[closestIndex][0];
//        data[i + 1] = centroids[closestIndex][1];
//        data[i + 2] = centroids[closestIndex][2];
//        data[i+3] = 255;
    }
    return groups;
}