
// NODE.JS 4JHAN SERVER
// WRITTEN BY PHIKAL
// LICENCE: GPL

// Database chooser

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
