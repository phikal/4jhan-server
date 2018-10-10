// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Thumbnail creator

var lwip = require('lwip'),
    config = require('../config');

module.exports = function(filename) {
    lwip.open('./img/' + filename, function(err, image) {
        if (err) return console.log(err);
        image.scale(150 / Math.min(image.width(), image.height()), function(err, image) {
            image.writeFile('./thumb/' + filename, function(err) {
                if (err) console.error(err);
            });
        });
    });
};
