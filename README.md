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

### Updates (`0.1.0` -> `0.1.1`): <a name="update"></a>

* **Reformated and improved `README.md`**
* Removed passwords (temp)
* Removed upload option, set to `./img/` (temp)

### Paths: <a name="path"></a>

### `GET:/`

The server information formated as as JSON object:

| **name** | **type** | **description** | **default** |
|----------|----------|-----------------|-------------|
| `name`   | `String` | Server name     | `Nameless 4jhan server` |
| `short`  | `String` | Short server name  | `z` |
| `admin`  | `String` | Admin pseudonym/name | |
| `discription` | `String` | Server description ( f.e.: What is server for? What kind? ) | `A 4jhan server` |
| `nsfw`   | `Boolean`| Is not server safe for work? | `false` |
| `timeout` | `Number` | After how many minutes are posts deleted? | `60` |
| `language` | `String` | Language used on server | `English` |
| `version` | `String` | Server version |  |
| `database` | `String` | Database used for server | `sqlite` |
| `page` | `Number` | Are pages used and items per page | |
| `imageForce` | `Boolean` | Do posts require images | `true` |
| `uptime` | `String` | Date on which server was started, [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) | |
| `extra` | `String` | Extra description ( rules, attribution, nonsense ) | |
| `files` | `Array`  | Allowed file types | ` [ 'png', 'jpg', 'gif' ] ` |

Some values may not be hosted, f.e.: `page`. If that is so, they are ignored ( no pages )

### `GET:/list`

A JSON array of posts
This is one post:
    
| **name** | **type** | **description** |
|----------|----------|-----------------|
| `id`     | `String` | The ID of the post. | 
| `title`  | `String` | The title of the post, can be undefined |
| `name`   | `String` | OP's pseudonym |
| `text`   | `String` | The posts text |
| `img`    | `String` | An image attached to the post, can be found in `config.upload` |
| `upload` | `String` | The post upload date, [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) |
    
### `GET:/thread/$id`

A JSON object contining a post and its comments.
It is built up just like the table above,
the only difference is an extra `thread` array, containing the comments.

This is one comment:

| **name** | **type** | **description** |
|----------|----------|-----------------|    
| `id`     | `String` | The ID of the comment |
| `name`   | `String` | Commenter's pseudonym |
| `text`   | `String` | The comments text |
| `img`    | `String` | An image attached to the post, can be found in `config.upload` |
| `upload` | `String` | The comment upload date, [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) |
    
The server may or may not send extra values, depending on the database used. These can be ignored.

#### `POST:/img/$img`

Returns image file `$img`.

#### `POST:/upload`

A `multipart/form-data` form used for uploading posts.
    
| **name** | **type** | **description** |
|----------|----------|-----------------| 
| `text`   | `String` | Containing post text. |
| `file`   | `File`   | *file-to-upload*, >1MB. |
| `title`  | `String` | Post title |
| `name`   | `String` | OP's pseudonym |
| `url`    | `String` | An URL, to which the user will be redirected after upload. Optional |

#### `POST:/comment`

| **name** | **type** | **description** |
|----------|----------|-----------------| 
| `text`   | `String` | Containing post text. |
| `file`   | `File`   | *file-to-upload*, >1MB. Optional |
| `name`   | `String` | OP's pseudonym |
| `url`    | `String` | An URL, to which the user will be redirected after upload. Optional |
| `op`     | `String` | ID of the post to add comment to. |

### Configuration: <a name="config"></a>

The configuration file is `config.json`.

| **name** | **type** | **description** |
|----------|----------|-----------------| 
| `db`     | `String` | Database to use, see options above |
| `user`   | `String` | MySQL user, if MySQL is used |
| `pass`   | `String` | MySQL password, if MySQL is used |
| `host`   | `String` | MySQL or MongoDB database URL |
| `name`   | `String` | Server name |
| `short`  | `String` | Short server name |
| `admin`  | `String` | Admin pseudonym/name |
| `discr`  | `String` | Server description |
| `nsfw`   | `Boolean` | Is not server safe for work? |
| `timeout` | `Number` | After how many minutes are posts deleted? |
| `language` | `String` | Language used on server |
| `page` | `Number` | Are pages used and items per page |
| `image` | `Boolean` | Do posts require images |
| `log` | `String` | Log HTTP requests and [Morgan format](https://github.com/expressjs/morgan) |
| `extra` | `String` | Extra description |
| `file` | `Array` | Allowed file types |

The config file is not necessary, it will default to values specified in `GET:/` if some or all are not defined. ( Not recommended )