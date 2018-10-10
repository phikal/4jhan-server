// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Tripcode generator

var crypto = require('crypto');

var config = require('../config.json') || {};

var regname = /^([^#]*)(#.*)?$/;
module.exports = function(name) {
    if (!name) return;
    if (!config.tripcode) return name.substr(0, namew.indexOf('#'));
    var parts = name.match(regname);
    return [parts[1], parts[2] ? crypto.pbkdf2Sync(parts[1], parts[2], 3, 10).toString('base64').substring(0, 9) : null];
};
