
// NODE.JS 4JHAN SERVER
// VERSION 0.1.1
// WRITTEN BY PHIKAL
// LICENCE: GPL

// SQLite interface

var config = require('./config.json');
var fs = require('fs');

module.exports = function() {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./4jhan.db');
	
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS post ("+
		"id INTEGER PRIMARY KEY AUTOINCREMENT,"+
		"title TEXT,"+
		"name TEXT,"+
		"text TEXT NOT NULL,"+
		"img TEXT,"+
		"upload CURRENT_TIMESTAMP"+
		")");
		db.run("CREATE TABLE IF NOT EXISTS comment ("+
		"id INTEGER PRIMARY KEY AUTOINCREMENT,"+
		"name TEXT,"+
		"text TEXT NOT NULL,"+
		"img TEXT,"+
		"upload CURRENT_TIMESTAMP,"+
		"op INTEGER"+
		")");
	});
	
	return {
		getList : function (page, next) {
			db.all(
				config.page ? "SELECT * from post ORDER BY -upload LIMIT "+((page+1 || 1)*config.page)+" OFFSET"+((page || 0)*config.page)
				: "SELECT * from post ORDER BY -upload",
				function(err,rows){
					if (err) return next(err);
					
					for (var i in rows) {
						rows[i].upload = new Date(rows[i].upload);
						if (!rows[i].name) delete rows[i].name;
					}
					
					next(null, rows || []);
				});
			},
			getThread : function (id, next) {
				db.all("SELECT * FROM post where id = "+id, function (err, resp) {
					if (err) return next(err);
					db.all("SELECT * FROM comment WHERE op = "+id, function (err, thread) {
						if (err) return next(err);
						
						resp[0].upload = new Date(resp[0].upload);
						if (!resp[0].name) delete resp[0].name;
						for (var i in thread) {
							thread[i].upload = new Date(thread[i].upload);
							if (!thread[0].name) delete thread[0].name;
						}
						
						resp[0].thread = thread;
						next(null, resp[0]);
					})
				});
			},
			newComment : function (com, next) {
				db.run("INSERT into comment(name, text, img,upload, op) VALUES (?,?,?,?,?)",
				com.name, com.text, com.img, com.upload, com.op,
				function (err) {
					if (err) return next(err);
					next();
				});
			},
			newPost : function (post, next) {
				db.run("INSERT into post(name, text, img,upload, title) VALUES (?,?,?,?,?)",
				post.name, post.text, post.img, post.upload, post.title,
				function (err) {
					if (err) return next(err);
					next();
				});
			},
			clear : function () {
				db.all("SELECT id, img FROM post WHERE upload < ?", new Date() - (6000*config.timeout) ,
				function (err,rows) {
					console.error(err);
					if (err) return;
					for (var i in rows) {
						db.all("SELECT img FROM comment WHERE op = date(?)", rows[i].id, function (err, rows) {
							console.error(err);
							for (var j in rows) 
								fs.unlink(config.upload+'/'+res[j].img, function(err) { if (err) console.log(err); });
							});
							db.run("DELETE FROM comment WHERE op = ?", rows[i].id);
							db.run("DELETE FROM post WHERE id = ?", rows[i].id);
						}
					});
				}
				
			};
		}