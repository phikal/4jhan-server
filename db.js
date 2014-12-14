var config = require('./config.json');
var fs = require('fs');

var mysqldb = function () {
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
	connection.connect(function(err) {
		if (err) return console.error('error connecting: ' + err.stack);
	});
	
	connection.query('CREATE TABLE IF NOT EXISTS post ('+
		'id INT NOT NULL AUTO_INCREMENT,'+
		'title VARCHAR(125),'+
		'name VARCHAR(25),'+
		'text varchar(2048) NOT NULL,'+
		'img VARCHAR(125),'+
		'upload TIMESTAMP,'+
		'PRIMARY KEY (id)'+
		');', function (err) { if (err) console.error(err); });
	connection.query('CREATE TABLE IF NOT EXISTS comment ('+
		'id INT NOT NULL AUTO_INCREMENT,'+
		'name VARCHAR(25),'+
		'text varchar(2048) NOT NULL,'+
		'img VARCHAR(125),'+
		'op INT,'+
		'upload TIMESTAMP,'+
		'PRIMARY KEY (id),'+
		'FOREIGN KEY (op)'+
		'REFERENCES post(id)'+
		'ON DELETE CASCADE'+
		');', function (err) { if (err) console.error(err); });
	
	return {
		getList : function (page, next) {
			connection.query(
				(config.page ? 'SELECT * FROM post ORDER BY -upload LIMIT ?,?' : 'SELECT * FROM post ORDER BY -upload'),
				(config.page ? [ (page || 0)*config.page, (page+1 || 1)*config.page ] : []),
				function(err, row) {
					if (err) return next(err);
					next(null, row || []);
			});
		},
		getThread : function (id, next) {
			connection.query('SELECT * FROM post WHERE id = ?', [ req.params.id ], function(err, resp) {
				if (err || !resp || resp.length == 0) return next(err || new Error('No such thread'));
				connection.query('SELECT * FROM comment WHERE op = ? ORDER BY upload', [ req.params.id ], function(err, thread) {
					if (err || !thread) return next(err || new Error('No such thread'));
					resp[0].thread = thread;
					next(null, resp[0]);
				});
			});
		},
		newComment : function (com, next) {
			connection.query("INSERT INTO comment SET ?", com, function(err, row) {
				if (err) return next(err);
				next();
			});
		},
		newPost : function (post, next) {
			connection.query("INSERT INTO post SET ?", post, function(err, row) {
				if (err) return next(err);
				next();
			});
		},
		clear : function () {
			connection.query('SELECT id, img FROM post WHERE upload < ?', [new Date(new Date() - (1000*60*config.timeout))], function(err, res) {
				if (err) return;
				for (var i in res) {
					connection.query('SELECT img FROM comment WHERE op = ?',[res[i].id], function(err, res) {
						for (var j in res)
							fs.unlink(config.upload+'/'+res[j].img, function(err) { if (err) console.log(err); });
						});
					connection.query('DELETE FROM post WHERE id = ?', [res[i].id], function(err, res) { });
					fs.unlink(config.upload+'/'+res[i].img, function(err) { if (err) console.log(err); });
				}
			});
		}
		
	};
}

var mongodb = function () {
	var db = require('mongoose');
	db.connect(config.host);
	var Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

	var Post = mongoose.model('Post', new Schema({
		_id		: ObjectId,
		title	: String,
		name	: String,
		text	: String,
		img		: String,
		upload	: Date,
		thread	: [
			{
				name	: String,
				text	: String,
				img		: String,
				upload	: Date
			}
		]
	}));
	
	return {
		getList : function (page, next) {
			if (config.page) Post.find()
				.skip(page*config.page)
				.limt(config.page)
				.sort('-upload')
				.exec(function (err, resp) {
					if (err) return next(err);
					next(null, resp);
				});
			else Post.find()
				.sort('-upload')
				.exec(function (err, resp) {
					if (err) return next(err);
					next(null, resp);
				});
		},
		getThread : function (id, next) {
			Post.findOne({ id : id }, function (err, resp) {
				if (err) return next(err);
				next(null, resp);
			});
		},
		newComment : function (com, next) {
			Post.findOne({ id : com.op }, function (err, resp) {
				if (err) return next(err);
				resp.thread.push(com);
				resp.save(function (err) {
					if (err) return next(err);
					next();
				});
			});
		},
		newPost : function (post, next) {
			new Post(post).save(function (err) {
				if (err) return next(err);
				next();
			})
		},
		clear : function () {
			Post.find({ "upload": {  $lt: new Date(new Date() - (1000*60*config.timeout)) }},
			function (err, res) {
				if (err) return;
				fs.unlink(config.upload+'/'+res.img, function(err) { if (err) console.log(err); });
				for (var i in res.thread)
					fs.unlink(config.upload+'/'+res.thread[i].img, function(err) { if (err) console.log(err); });
			});
			Post.remove({ "upload": {  $lt: [new Date(new Date() - (1000*60*config.timeout))] }},
				function (err) { });
		}
		
	};
}

var sqlitedb = function () {
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
			db.all("SELECT id, img FROM post WHERE upload < ?", new Date() - (1000*60*config.timeout) ,
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

module.exports = function(db) {
	console.log("Using DB: "+db);
	switch (db) {
		case 'mysql': return mysqldb();
		case 'mongo': return mongodb();
		case 'sqlite': return sqlitedb();
		default:
			console.error('Database "'+db+'" is not valid.');
			process.exit(1);
	}
}
