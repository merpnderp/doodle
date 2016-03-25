const findDistance = require('./findDistanceBetweenPoints');
let colorDist, dist, o, i, closest, closestIndex;

module.exports = function (centroids, data) {
    let groups = [];

    for (i = 0; i < centroids.length; i++) {
        groups[i] = [];
    }

    for (i = 0; i < data.length; i += 4) {
        closest = Number.MAX_SAFE_INTEGER;
        closestIndex = 0;
        for (o = 0; o < centroids.length; o++) {
            //colorDist = findDistance([data[i], data[i + 1], data[i + 2]], [centroids[o][0], centroids[o][1], centroids[o][2]]);
            dist = findDistance([data[i], data[i + 1], data[i + 2]], [centroids[o][0], centroids[o][1], centroids[o][2]]);

            if (dist < closest) {
                closest = dist;
                closestIndex = o;
            }
        }
        groups[closestIndex].push([data[i], data[i + 1], data[i + 2], data[i + 3]])
    }
    return groups;
}