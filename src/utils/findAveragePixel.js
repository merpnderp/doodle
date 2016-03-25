let r, g, b;
module.exports = function(data){
    r = 0;g=0;b=0;
    data.map(function(d){
        r += d[0];
        g += d[1];
        b += d[2];
    })
    r /= data.length;
    g /= data.length;
    b /= data.length;
    return [r,g,b];
}