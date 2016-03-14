var im = require('imagemagick');
im.readMetadata('./wizard.jpg', function(err, metadata){
  if (err) throw err;
  console.log('Shot at '+metadata.exif.dateTimeOriginal);
})
