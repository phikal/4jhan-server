## 4jhan node.js server

*v0.1.1, by phikal*

4jhan, inspired by [4chan](http://www.4chan.org/),
is a minimal server-client network, where a board ( f.e.: `/b/`, `/g/`, `/pol/`,... )
are hosted on individual servers.
These servers only host [JSON](http://www.json.org/) data and have to be interpreted via clients (native or web). See [paths](#path) for specifics.

Databases can be set withing the [config](#config).
[MySQL](http://www.mysql.com/), [MongoDB](http://www.mongodb.org/) and [SQLite](http://www.sqlite.org/) (default) are currently supported.

The server is written in [node.js](http://nodejs.org/) and was tested on Linux (Fedora, Arch, Raspbian). 
It is lightweight enough to be run on a [Raspberry Pi](http://www.raspberrypi.org/) ( `sqlite` recommended ).
This is open ( [GPL](/LICENSE), see `LICENSE` ) and unfinished software, **expect errors** and keep updated.

Packages have to be installed before using from the project directory via [nmp](https://www.npmjs.com/):

`$ npm install`

### To start server , type: <a name="start"></a>

`$ ./bin/www`

Add `&` to run in background and `> logfile` to output to file.

For more information, take a look at '/doc/'