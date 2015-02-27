
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Tripcode generator

var crypto = require('crypto');

module.exports = function(name, pass) {
	if (!pass) return;
	return crypto.pbkdf2Sync(name || 'anon', pass || '', 3, 12).toString('base64');
};
