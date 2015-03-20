var path = require('path'),
    lwip = require('lwip'),
    config = require('../config');

module.exports.createThumb = function(filename) {
    lwip.open('./img/' + filename, function(err, image) {
        if (err) return console.log(err);
        image.batch()
            .resize(config.width,config.height,'cubic')
            .writeFile('./thumb/' + filename, function(err) {
                if (err) return false;
            });
        });
}
