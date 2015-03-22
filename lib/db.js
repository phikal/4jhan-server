
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Database manager

var orm = require("orm"),
    config = require('../config.json'),
    fs = require('fs'),
    erresp = require('./erresp'),
    tripcode = require('./tripcode');

module.exports = function(db) {
	console.log("Using DB: "+db);
	switch (db) {
		case 'mysql':	return require('./mysql')();
		case 'mongo':	return require('./mongo')();
		case 'sqlite':	return require('./sqlite')();
		default:
			console.error('Database "'+db+'" is not valid.');
			process.exit(1);
	}
};
