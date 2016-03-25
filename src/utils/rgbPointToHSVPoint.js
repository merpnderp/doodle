let computedH = 0;
let computedS = 0;
let computedV = 0;
let minRGB = 0;
let maxRGB = 0;
let d = 0;
let h = 0;
let r, g,b;

module.exports = function (r, g, b) {
    computedH = 0;
    computedS = 0;
    computedV = 0;

    //remove spaces from input RGB values, convert to int
    r = parseInt(('' + r).replace(/\s/g, ''), 10);
    g = parseInt(('' + g).replace(/\s/g, ''), 10);
    b = parseInt(('' + b).replace(/\s/g, ''), 10);

    if (r == null || g == null || b == null ||
        isNaN(r) || isNaN(g) || isNaN(b)) {
        alert('Please enter numeric RGB values!');
        return;
    }
    if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
        alert('RGB values must be in the range 0 to 255.');
        return;
    }
    r = r / 255;
    g = g / 255;
    b = b / 255;
    minRGB = Math.min(r, Math.min(g, b));
    maxRGB = Math.max(r, Math.max(g, b));

    // Black-gray-white
    if (minRGB == maxRGB) {
        computedV = minRGB;
        return [0, 0, computedV];
    }

    // Colors other than black-gray-white:
    d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
    h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
    computedH = 60 * (h - d / (maxRGB - minRGB));
    computedS = (maxRGB - minRGB) / maxRGB;
    computedV = maxRGB;
    return [computedH, computedS, computedV];


}