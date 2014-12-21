## 4jhan node.js server

*v0.1.3, by phikal*

4jhan, inspired by [4chan](http://www.4chan.org/),
is a minimal server-client network, where a board ( f.e.: `/b/`, `/g/`, `/pol/`,etc.)
are hosted on individual servers.
These servers only host [JSON](http://www.json.org/) data and have to be interpreted via clients (native or web). See [paths](/doc/PATHS.md) for specifics. By default the server will host on port 3000, this can be changed with the `PORT` env variable.

Databases can be set withing the config.
[MySQL](http://www.mysql.com/), [MongoDB](http://www.mongodb.org/) and [SQLite](http://www.sqlite.org/) (default) are currently supported.

The server is written in [node.js](http://nodejs.org/) and was tested on Linux (Fedora, Arch, Raspbian). 
It is lightweight enough to be run on a [Raspberry Pi](http://www.raspberrypi.org/) ( `sqlite` recommended ).
This is open ([GPL](/LICENSE), see `LICENSE`) and unfinished software, **expect errors** and keep updated.

Packages have to be installed before using from the project directory via [nmp](https://www.npmjs.com/):

`$ npm install`

If for storeage reasons not all dependancies can be installed, unnececcary database packeage can be removed.

### To start server , type:

`$ ./bin/www`

Optionally add `&` to run in background or/and `> logfile` to output to file.

For more information (changes, todo, etc.), take a look at [/doc/](/doc)
