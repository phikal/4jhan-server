
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Database manager

var getAllMethods = function(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
};

var orm = require("orm"),
    config = require('../config.json'),
    fs = require('fs');

var erresp = function(err) {
    if (err) console.error(err);
};

module.exports = function(db, next) {
    orm.connect((db || 'sqlite://./4jhan.db'), function(err, db) {
	if (err) {
	    console.error(err);
	    return next();
	}
	    
	var Post = db.define('post', {
	    id : { type : 'serial', key : true },
	    title : String,
	    name : String,
	    text : String,
	    img  : String,
	    upload : Date,
	    tripcode : String
	});
	var Comment = db.define('comment', {
	    id : { type : 'serial', key : true },
	    name : String,
	    text : String,
	    img  : String,
	    upload : Date,
	    tripcode : String
	});
	Comment.hasOne('post', Post, { reverse: 'thread' });

	db.sync(function(err) {
	    if (err) return next(err);
	    next(undefined, {
		getList : function(page, next) {
		    var quer = Post.find();
		    if (config.page) quer
			.offset(page*config.page)
			.limit(page);
		    quer.order('-upload').run(function(err, resp) {
			console.log(err);
			if (err) return next(500);
			if (!resp) return next(undefined, []);
			next(undefined, resp);
		    });
		},
		getThread : function(id, next) {
		    Post.get(id, function(err, post) {
			if (!post) return next(404);
			if (err) return next(500);
			post.getThread(function(err, replies) {
			    if (err) return next(501);
			    next(undefined, post);
			});
		    });
		},
		newComment : function(com, next) {
		    Post.get(com.op, function(err, post) {
			if (!post) return next(404);
			if (err) return next(500);
			Comment.create([com], function(err, item) {
			    if (err) return next(500);
			    if (!item) return next(400);
			    item[0].setPost(post, function(err) {
				if (err) return next(500);
				next();
			    });
			});
		    });
		},
		newPost : function(post, next) {
		    Post.create([post], function(err, item) {
			if (err) return next(500);
			next();
		    });
		},
		clear : function() {
		    Post.find({ "upload" : orm.lt(new Date(new Date() - (6000*config.timeout))) }, function(err, posts) {
			var del = function(dir, file) {
			    fs.exists(dir+'/'+file, function(e) {
				if (e) fs.unlink(dir+'/'+file, erresp);
			    });
			};
			var processcom = function(err, com) {
			    for (var i in com.thread) {
				del((config.upload || './img'), com.thread[i].img);
				del('./thumb', com.thread[i].img);
			    }
			};
			for (var i in posts) {
			    if (err) return;
			    fs.unlink((config.upload || './img')+'/'+posts[i].img, erresp);
			    fs.unlink('./thumb/'+posts[i].img, erresp);
			    posts[i].getThread(processcom);
			    posts[i].remove(erresp);
			}
		    });
		}
	    });
	});
    });
};
