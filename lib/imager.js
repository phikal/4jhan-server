
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Thumbnail creator

var lwip = require('lwip'),
    config = require('../config');

module.exports = function(filename) {
    lwip.open('./img/' + filename, function(err, image) {
        if (err) return console.log(err);
        image.batch()
            .resize(config.width,config.height,'cubic')
            .writeFile((config.thumb || './thumb/') + filename, function(err) {
                if (err) console.error(err);
	});
    });
};
