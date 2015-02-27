
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// MySQL interface

var config = require('../config.json');
var fs = require('fs');
var erresp = require('./erresp');
var tripcode = require('./tripcode');

module.exports = function() {
	var db = require('mysql');

	if (!(config ||(config.user && config.pass))) {
		console.error('config.json not complete');
		process.exit(1);
	}

	var connection = mysql.createConnection({
		host     : config.host,
		user     : config.user,
		password : config.pass,
		database : config.database || 'jhan'
	});
	connection.connect(erresp);

	connection.query('CREATE TABLE IF NOT EXISTS post ('+
		'id INT NOT NULL AUTO_INCREMENT,'+
		'title VARCHAR(125),'+
		'name VARCHAR(25),'+
		'text varchar(2048) NOT NULL,'+
		'img VARCHAR(125),'+
		'upload TIMESTAMP,'+
		'tripcode VARCHAR(12),'+
		'PRIMARY KEY (id)'+
		');', erresp);
	connection.query('CREATE TABLE IF NOT EXISTS comment ('+
		'id INT NOT NULL AUTO_INCREMENT,'+
		'name VARCHAR(25),'+
		'text varchar(2048) NOT NULL,'+
		'img VARCHAR(125),'+
		'op INT,'+
		'upload TIMESTAMP,'+
		'tripcode VARCHAR(12),'+
		'PRIMARY KEY (id),'+
		'FOREIGN KEY (op)'+
		'REFERENCES post(id)'+
		'ON DELETE CASCADE'+
		');', erresp);

	return {
		getList : function (page, next) {
			connection.query(
				(config.page ? 'SELECT * FROM post ORDER BY -upload LIMIT ?,?' : 'SELECT * FROM post ORDER BY -upload'),
				(config.page ? [ (page || 0)*config.page, (page+1 || 1)*config.page ] : []),
				function(err, row) {
					if (err) return next(err);
					for (var i in row)
						for (var k in [i])
							if (!thread[i][k])
								delete thread[i][k];
					next(null, row || []);
			});
		},
		getThread : function (id, next) {
			connection.query('SELECT * FROM post WHERE id = ?', [ req.params.id ], function(err, resp) {
				if (err || !resp || resp.length === 0) return next(err || new Error('No such thread'));
				connection.query('SELECT * FROM comment WHERE op = ? ORDER BY upload', [ req.params.id ], function(err, thread) {
					if (err || !thread) return next(err || new Error('No such thread'));
					for (var i in thread)
						for (var k in thread[i])
							if (!thread[i][k])
								delete thread[i][k];
					for (var l in resp[0])
						if (!resp[0][l])
							delete resp[0][l];
					resp[0].thread = thread;
					next(null, resp[0]);
				});
			});
		},
		newComment : function (com, next) {
			if (config.tripcode && com.pass) com.tripcode = tripcode(com.name, com.pass);
			connection.query("INSERT INTO comment SET ?", com, function(err, row) {
				if (err) return next(err);
				next();
			});
		},
		newPost : function (post, next) {
			if (config.tripcode && post.pass) post.tripcode = tripcode(post.name, post.pass);
			connection.query("INSERT INTO post SET ?", post, function(err, row) {
				if (err) return next(err);
				next();
			});
		},
		clear : function () {
			connection.query('SELECT id, img FROM post WHERE upload < ?', [new Date(new Date() - (60000*config.timeout))], function(err, res) {
				if (err) return;
				for (var i in res) {
					connection.query('SELECT img FROM comment WHERE op = ?',[res[i].id], function(err, res) {
						for (var j in res)
							fs.unlink(config.upload+'/'+res[j].img, erresp);
					});
					connection.query('DELETE FROM post WHERE id = ?', [res[i].id], erresp);
					fs.unlink(config.upload+'/'+res[i].img, erresp);
				}
			});
		}
	};
};
