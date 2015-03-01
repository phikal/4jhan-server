
// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Main server file

// Imports
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    auth = require('basic-auth'),
    marked = require('marked-no-images');

// Get config
var config = require('./config.json') || {};

// Info & config setup for 'GET:/'
var info = {
    name : config.name || "Nameless 4jhan server",
    short : config.short || "z",
    admin : config.admin,
    discription : config.discr || "A 4jhan server",
    nsfw : config.nsfw || false,
    timeout : config.timeout || (config.timeout = 60),
    language : config.lang || "English",
    version : require('./package.json').version,
    database : config.db || (config.db = "sqlite"),
    page : config.page,
    imageForce : config.image || (config.image = true),
    uptime : new Date().toUTCString(),
    extra : config.extra,
    files : config.files || (config.files = [ 'png', 'jpg', 'gif' ])
};

// DB setup
var db = require("./lib/db")(config.db);

// Express setup
var app = express();
if (config.log) app.use((require('morgan'))(config.log));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(multer({ dest: config.upload || './img/'}));

// Markdown setup
if (config.markdown)
    marked.setOptions({ sanitize: true });

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.auth = auth(req);
    next();
});

// Get server info
app.get('/', function(req,res) {
    res.send(info);
});

// Get list of posts (limited to config.page if set)
app.get('/list', function(req,res) {
    db.getList(req.query.page, function (err, resp) {
        if (err) res.send(500);
		for (var i in resp.thread)
			resp.thread[i].upload = new Date(resp.upload[i].upload).toUTCString();
        res.send(resp);
    });
});

// Get comments on post i.e. Thread
app.get('/thread/:id', function(req,res) {
    db.getThread(req.params.id, function (err, resp) {
        if (err) return res.send(500);
		if (!resp) return res.send(404);

		resp.upload = new Date(resp.upload).toUTCString();
		for (var i in resp.thread)
			resp.thread[i].upload = new Date(resp.upload[i].upload).toUTCString();

        res.send(resp);
    });
});

app.get('/img/:img', function(req,res) {
    res.sendfile((config.upload || './img/')+req.params.img);
});

// Upload post (and image if config.image)
app.post('/upload', function(req,res) {
    if (!req.body.text && (!config.image || req.files.file))
        return res.send(400);
    if (req.files.file && config.files.indexOf(req.files.file.originalname.split('.').pop()) == -1)
        return res.send(415);

    db.newPost({
        title : req.body.title,
        name : req.body.name,
        text : config.markdown ? marked(req.body.text) : req.body.text,
        img : req.files.file ? req.files.file.name : undefined,
		pass : req.body.pass,
        upload : new Date()
    }, function (err) {
        if (err) return res.send(500);
        if (req.body.next) return res.redirect(req.body.next);
        res.send();
    });
});

// Comment on Post, image optional
app.post('/comment', function(req,res) {
    if (!req.body.text)
        return res.send(400);
    if (req.files.file && config.files.indexOf(req.files.file.originalname.split('.').pop()) == -1)
        return res.send(415);

	db.newComment({
        name : req.body.name,
        text : config.markdown ? marked(req.body.text) : req.body.text,
        op :   req.body.op,
        img :  req.files.file ? req.files.file.name : undefined,
		pass : req.body.pass,
        upload : new Date(),
    }, function (err) {
        if (err) return res.send(500);
        if (req.body.next) return res.redirect(req.body.next);
        res.send();
    });
});

// Load robots.txt file if it exists
if (fs.existsSync('./robots.txt')) app.get('/robots.txt', function(req,res) {
	 res.sendfile('./robots.txt');
});

// Delete too old posts. (set by config.timeout)
setInterval(db.clear, 6000*config.timeout);

module.exports = app;
