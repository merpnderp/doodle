const findDistance = require('./findDistanceBetweenPoints');

module.exports = function (data, centroids) {
    for (let i = 0; i < data.length; i += 4) {
        let closest = Number.MAX_SAFE_INTEGER;
        let closestIndex = 0;
        for (let o = 0; o < centroids.length; o++) {
            let dist = findDistance([data[i], data[i + 1], data[i + 2]], [centroids[o][0], centroids[o][1], centroids[o][2]]);
            if (dist < closest) {
                closest = dist;
                closestIndex = o;
            }
        }
        data[i] = centroids[closestIndex][0];
        data[i + 1] = centroids[closestIndex][1];
        data[i + 2] = centroids[closestIndex][2];
//        data[i+3] = 255;
    }
    return data;
}