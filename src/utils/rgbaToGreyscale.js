let i, brightness;
module.exports = function(data){
    for (i = 0; i < data.length; i += 4) {
        //let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        //HDTV def for greyscale
        brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
    }
    return data;
}