
// NODE.JS 4JHAN SERVER
// WRITTEN BY PHIKAL
// LICENCE: GPL

// Mongo DB interface

var config = require('../config.json');
var fs = require('fs');
var erresp = require('./erresp');
var tripcode = require('./tripcode');

module.exports = function() {
	var db = require('mongoose');
	db.connect(config.host);
	var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;
	
	var Post = mongoose.model('Post', new Schema({
		_id		: ObjectId,
		title	: String,
		name	: String,
		text	: String,
		img		: String,
		upload	: Date,
		tripcode: String,
		thread	: [{
			name	: String,
			text	: String,
			img		: String,
			upload	: Date,
			tripcode: String
		}]
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
				if (config.tripcode && com.pass) com.tripcode = tripcode(com.name, com.pass);
				resp.thread.push(com);
				resp.save(function (err) {
					if (err) return next(err);
					next();
				});
			});
		},
		newPost : function (post, next) {
			if (config.tripcode && post.pass) post.tripcode = tripcode(post.name, post.pass);
			new Post(post).save(function (err) {
				if (err) return next(err);
				next();
			});
		},
		clear : function () {
			Post.find({ "upload": {  $lt: new Date(new Date() - (6000*config.timeout)) }}, function (err, res) {
				if (err) return;
				fs.unlink(config.upload+'/'+res.img, erresp);
				for (var i in res.thread)
					fs.unlink(config.upload+'/'+res.thread[i].img, erresp);
			});
			Post.remove({ "upload": {  $lt: [new Date(new Date() - (1000*60*config.timeout))] }},erresp);
		}
	};
};
