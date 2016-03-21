
exports.grayscale = function(pixels, width, height, fillRGBA) {
    var gray = new Uint8ClampedArray(fillRGBA ? pixels.length : pixels.length >> 2);
    var p = 0;
    var w = 0;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var value = pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114;
            gray[p++] = value;

            if (fillRGBA) {
                gray[p++] = value;
                gray[p++] = value;
                gray[p++] = pixels[w + 3];
            }

            w += 4;
        }
    }
    return gray;
};

exports.blur = function(pixels, width, height, diameter) {
    diameter = Math.abs(diameter);
    if (diameter <= 1) {
        throw new Error('Diameter should be greater than 1.');
    }
    var radius = diameter / 2;
    var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));
    var weights = new Float32Array(len);
    var rho = (radius + 0.5) / 3;
    var rhoSq = rho * rho;
    var gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
    var rhoFactor = -1 / (2 * rho * rho);
    var wsum = 0;
    var middle = Math.floor(len / 2);
    for (var i = 0; i < len; i++) {
        var x = i - middle;
        var gx = gaussianFactor * Math.exp(x * x * rhoFactor);
        weights[i] = gx;
        wsum += gx;
    }
    for (var j = 0; j < weights.length; j++) {
        weights[j] /= wsum;
    }
    return separableConvolve(pixels, width, height, weights, weights, false);
};

const horizontalConvolve = function(pixels, width, height, weightsVector, opaque) {
    var side = weightsVector.length;
    var halfSide = Math.floor(side / 2);
    var output = new Float32Array(width * height * 4);
    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var sy = y;
            var sx = x;
            var offset = (y * width + x) * 4;
            var r = 0;
            var g = 0;
            var b = 0;
            var a = 0;
            for (var cx = 0; cx < side; cx++) {
                var scy = sy;
                var scx = Math.min(width - 1, Math.max(0, sx + cx - halfSide));
                var poffset = (scy * width + scx) * 4;
                var wt = weightsVector[cx];
                r += pixels[poffset] * wt;
                g += pixels[poffset + 1] * wt;
                b += pixels[poffset + 2] * wt;
                a += pixels[poffset + 3] * wt;
            }
            output[offset] = r;
            output[offset + 1] = g;
            output[offset + 2] = b;
            output[offset + 3] = a + alphaFac * (255 - a);
        }
    }
    return output;
};

const verticalConvolve = function(pixels, width, height, weightsVector, opaque) {
    var side = weightsVector.length;
    var halfSide = Math.floor(side / 2);
    var output = new Float32Array(width * height * 4);
    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var sy = y;
            var sx = x;
            var offset = (y * width + x) * 4;
            var r = 0;
            var g = 0;
            var b = 0;
            var a = 0;
            for (var cy = 0; cy < side; cy++) {
                var scy = Math.min(height - 1, Math.max(0, sy + cy - halfSide));
                var scx = sx;
                var poffset = (scy * width + scx) * 4;
                var wt = weightsVector[cy];
                r += pixels[poffset] * wt;
                g += pixels[poffset + 1] * wt;
                b += pixels[poffset + 2] * wt;
                a += pixels[poffset + 3] * wt;
            }
            output[offset] = r;
            output[offset + 1] = g;
            output[offset + 2] = b;
            output[offset + 3] = a + alphaFac * (255 - a);
        }
    }
    return output;
};

const separableConvolve = function(pixels, width, height, horizWeights, vertWeights, opaque) {
    var vertical = verticalConvolve(pixels, width, height, vertWeights, opaque);
    return horizontalConvolve(vertical, width, height, horizWeights, opaque);
};
