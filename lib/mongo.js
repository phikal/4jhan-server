
// NODE.JS 4JHAN SERVER
// VERSION 0.1.1
// WRITTEN BY PHIKAL
// LICENCE: GPL

// Mongo DB interface

var config = require('./config.json');
var fs = require('fs');

module.exports = function() {
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
					Post.find({ "upload": {  $lt: new Date(new Date() - (6000*config.timeout)) }},
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