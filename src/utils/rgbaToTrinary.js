module.exports = function (data) {
    var d = [], m = 0;
    for (let i = 0; i < data.length; i += 4) {
        d[m++] = [data[i], data[i + 1], data[i + 2]];
    }
    return d;
}