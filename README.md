# 4jhan node.js server

<img src="./4jhan.png" align="left" height="150" width="150"/>

4jhan, inspired by [4chan](http://www.4chan.org/),
is a minimal server-client network, where a board ( f.e.: `/b/`, `/g/`, `/pol/`,etc.)
are hosted on individual servers.
These servers only host [JSON](http://www.json.org/) data and have to be interpreted via clients (native or web). See [paths](/doc/PATHS.md) for specifics. By default the server will host on port 3000. If you want a different port, specify it in the `PORT` env variable. v

**Feel free to [contribute](/CONTRIBUTING.md)! Possible tasks can be found in the TODO wiki page**

Databases can be set withing the config.
[MySQL](http://www.mysql.com/), [MongoDB](http://www.mongodb.org/) and [SQLite](http://www.sqlite.org/) (default) are currently supported.

The server is written in [node.js](http://nodejs.org/) and was tested on Linux (Fedora, Arch, Raspbian).
It is lightweight enough to be run on a [Raspberry Pi](http://www.raspberrypi.org/) ( `sqlite` recommended ).
This is open ([MIT](/LICENSE), see `LICENSE`) and work-in-progress software, **expect errors** and keep updated.

---

Packages have to be installed before using from the project directory via [nmp](https://www.npmjs.com/):

```Shell
$ npm install
```

SQLite is installed by default. If you want to use other databases, install them via these commands:

```Shell
$ npm install mongoose # for mongo db
$ npm install mysql3
```

Make sure to set the database in your config file too. (default sqlite)

---

### To start server , type:

```Shell
$ ./bin/www
```

Optionally add `&` to run in background.
If you want to let it run on another computer in the background,
make sure it has [SSH](https://en.wikipedia.org/wiki/Secure_Shell) and type:

```Shell
ssh user@host -f "/path/to/www/bin"
```

It will now be running in the background.

**Note:** Don't copy directly. Duh.

**For more information (changes, paths, etc.), take a look at [doc/](/doc)**
