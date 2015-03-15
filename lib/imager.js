var fs = require('fs'),
    config = require('../config'),
    gm = require('gm');

exports.createThumb = function(filename) {
  gm('./img/' + filename)
    .resize(config.length, config.height)
    .write('./thumb/' + filename,  function (err) {
      if (!err) return true;
    });
}
