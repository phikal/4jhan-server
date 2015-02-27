
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// SQLite interface

var config = require('../config.json');
var fs = require('fs');
var erresp = require('./erresp');
var tripcode = require('./tripcode');

module.exports = function() {
	var db = new (require('sqlite3').verbose().Database)('./4jhan.db');

	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS post ("+
			   "id INTEGER PRIMARY KEY AUTOINCREMENT,"+
			   "title TEXT,"+
			   "name TEXT,"+
			   "text TEXT NOT NULL,"+
			   "img TEXT,"+
			   "upload CURRENT_TIMESTAMP,"+
			   "tripcode TEXT"+
			   ")");
		db.run("CREATE TABLE IF NOT EXISTS comment ("+
			   "id INTEGER PRIMARY KEY AUTOINCREMENT,"+
			   "name TEXT,"+
			   "text TEXT NOT NULL,"+
			   "img TEXT,"+
			   "upload CURRENT_TIMESTAMP,"+
			   "tripcode TEXT,"+
			   "op INTEGER"+
			   ")");
	});

	return {
		getList : function (page, next) {
			db.all(config.page ? "SELECT * from post ORDER BY -upload LIMIT "+((page+1 || 1)*config.page)+" OFFSET"+((page || 0)*config.page):"SELECT * from post ORDER BY -upload",
				function(err,rows) {
					if (err) return next(err);
					next(null, rows || []);
			});
		},
		getThread : function (id, next) {
			db.all("SELECT * FROM post where id = ?", id, function (err, resp) {
				if (err || !resp) return next(err);
				db.all("SELECT * FROM comment WHERE op = ?",id, function (err, thread) {
					if (err || !thread) return next(err);
					resp[0].thread = thread;
					next(null, resp[0]);
				});
			});
		},
		newComment : function (com, next) {
			if (config.tripcode && com.pass) com.tripcode = tripcode(com.name, com.pass);
			db.run("INSERT into comment(name, text, img,upload, op, tripcode) VALUES (?,?,?,?,?,?)",
				com.name, com.text, com.img, com.upload, com.op, com.tripcode,
				function (err) {
					if (err) return next(err);
					next();
			});
		},
		newPost : function (post, next) {
			if (config.tripcode && post.pass) post.tripcode = tripcode(post.name, post.pass);
			db.run("INSERT into post(name, text, img, upload, title, tripcode) VALUES (?,?,?,?,?,?)",
				post.name, post.text, post.img, post.upload, post.title, post.tripcode,
				function (err) {
					if (err) return next(err);
					next();
			});
		},
		clear : function () {
			db.all("SELECT id, img FROM post WHERE upload < ?", new Date() - (60000*config.timeout) ,
				function (err,rows) {
					if (err) return;
					var del = function (err, rows) {
						for (var j in rows)
							fs.unlink(config.upload+res[j].img, erresp);
					};
					for (var i in rows) {
						db.all("SELECT img FROM comment WHERE op = date(?)", rows[i].id, del);
						db.run("DELETE FROM comment WHERE op = ?", rows[i].id);
						db.run("DELETE FROM post WHERE id = ?", rows[i].id);
					}
			});
		}

	};
};
