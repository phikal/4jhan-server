// NODE.JS 4JHAN SERVER
// LICENCE: MIT

// Main server file

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    auth = require('basic-auth'),
    marked = require('marked-no-images'),
    imager = require('./lib/imager');

// Get config
var config = require('./config.json') || {};

// Info & config setup for 'GET:/'
var info = {
    name: config.name || 'Nameless 4jhan server',
    short: config.short || 'z',
    admin: config.admin,
    description: config.descr || 'A 4jhan server',
    nsfw: config.nsfw || false,
    timeout: config.timeout || (config.timeout = 60),
    language: config.lang || 'English',
    version: require('./package.json').version,
    page: config.page,
    imageForce: (config.image === false ? false : (config.image = true)),
    uptime: new Date().toUTCString(),
    extra: config.extra,
    files: config.files || (config.files = ['png', 'jpg', 'gif']),
    tripcode: (config.tripcode === false ? false : (config.tripcode = true)),
    access: config.pass ? 'pass' : config.auth ? 'auth' : undefined
};

// DB setup
var db = {};
require('./lib/db')(config.db, function(err, res) {
    if (!res || err) {
        console.error(err);
        process.exit(1);
    }
    db = res;
    setInterval(db.clear, config.timeout * 6000);
    console.log('Database set up.');
});

// Express setup
var app = express();
if (config.log) app.use((require('morgan'))(config.log));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(multer({
    dest: config.upload || './img/'
}));

// Markdown setup
if (config.markdown)
    marked.setOptions({
        sanitize: true
    });

// Name parsing & tripcode gen

var nameparse = require('./lib/tripcode.js');

// Enable CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    req.auth = auth(req);

    //config.auth.indexOf(nameparse(req.auth.name+'#'+req.auth.pass)[1])

    if (req.auth) console.log(nameparse(req.auth.name + '#' + req.auth.pass)[1]);

    if (req.url == '/') return res.send(info);
    if (config.pass && (!req.auth || req.auth.pass != config.pass) ||
        config.auth && (!req.auth))
        return res.send(401);
    else
        next();
});

// Get list of posts (limited to config.page if set)
app.get('/list', function(req, res) {
    db.getList(req.query.page, function(err, resp) {
        if (err) return res.send(err);
        for (var i in resp)
            for (var j in resp[i])
                if (!resp[i][j])
                    delete resp[i][j];
        res.send(resp);
    });
});

// Get comments on post i.e. Thread
app.get('/thread/:id', function(req, res) {
    db.getThread(req.params.id, function(err, resp) {
        if (err) return res.send(err);
        res.send(resp);
    });
});

// If config.static is not defined, let it be true (default)
if (config.static === undefined) config.static = true;
if (config.static) {
    // Send image
    var simg = function(res, img) {
        fs.exists('./img/' + img, function(exists) {
            if (exists) return res.sendfile((config.upload || './img/') + img);
            res.send(404);
        });
    };

    // Image
    app.get('/img/:img', function(req, res) {
        simg(res, req.params.img);
    });

    // Thumbnail or raw image
    app.get('/thumb/:thumb', function(req, res) {
        if (config.thumb) fs.exists('./thumb/' + req.params.thumb, function(exists) {
            if (exists) res.sendfile('./thumb/' + req.params.thumb);
            else simg(res, req.params.thumb);
        });
        else simg(res, req.params.thumb);
    });
}

// Upload post (and image if config.image)
app.post('/upload', function(req, res) {
    if (!req.body.text && (!config.image || req.files.file))
        return req.body.url ? res.redirect(req.body.url) : res.send(400);
    if (req.files.file && config.files.indexOf(req.files.file.name.split('.').pop()) == -1)
        return req.body.url ? res.redirect(req.body.url) : res.send(415);
    if (config.thumb)
        imager(req.files.file.name);

    var parts = nameparse(req.body.name);
    db.newPost({
        title: req.body.title,
        name: parts ? parts[0] : undefined,
        text: config.markdown ? marked(req.body.text) : req.body.text,
        img: req.files.file ? req.files.file.name : undefined,
        upload: new Date(),
        modif: new Date(),
        tripcode: parts ? parts[1] : undefined
    }, function(err) {
        if (err) return res.send(err);
        if (req.body.url) return res.redirect(req.body.url);
        res.send();
    });
});

// Comment on Post, image optional
app.post('/comment', function(req, res) {
    if (!req.body.text)
        return req.body.url ? res.redirect(req.body.url) : res.send(400);
    if (req.files.file && config.files.indexOf(req.files.file.name.split('.').pop()) == -1)
        return req.body.url ? res.redirect(req.body.url) : res.send(415);
    if (config.thumb && req.files.file)
        imager(req.files.file.name);

    var parts = nameparse(req.body.name);
    db.newComment({
        name: parts ? parts[0] : undefined,
        text: config.markdown ? marked(req.body.text) : req.body.text,
        op: req.body.op,
        img: req.files.file ? req.files.file.name : undefined,
        upload: new Date(),
        tripcode: (parts ? parts[1] : undefined)
    }, function(err) {
        if (err) return res.send(err);
        if (req.body.url) return res.redirect(req.body.url);
        res.send();
    });
});

// Load robots.txt file if it exists
if (fs.existsSync('./robots.txt')) app.get('/robots.txt', function(req, res) {
    res.sendfile('./robots.txt');
});

module.exports = app;
