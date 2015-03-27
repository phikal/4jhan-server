## Configuration

The configuration file is `config.json`. It has to be places in the root project directory.

| **name** | **type** | **description** |
|----------|----------|-----------------|
| `db`     | `String` | Database to use, see [README.md](/README.md). |
| `user`   | `String` | MySQL user, if MySQL is used |
| `pass`   | `String` | MySQL password, if MySQL is used |
| `host`   | `String` | MySQL or MongoDB database URL |
| `name`   | `String` | Server name |
| `short`  | `String` | Short server name |
| `admin`  | `String` | Admin pseudonym/name |
| `descr`  | `String` | Server description |
| `nsfw`   | `Boolean` | Is not server safe for work? |
| `timeout` | `Number` | After how many minutes are posts deleted? |
| `language` | `String` | Language used on server |
| `page` | `Number` | Are pages used and items per page |
| `image` | `Boolean` | Do posts require images |
| `log` | `String` | Log HTTP requests and [Morgan format](https://github.com/expressjs/morgan) |
| `extra` | `String` | Extra description |
| `file` | `Array` | Allowed file types |
| `tripcode` | `Boolean` | Are tripcodes enabled? |
| `upload` | `String` | Local directory for image uplaod, `./img/` as default |
| `markdown` | `Boolean` | Enable Markdown input (HTML output). |
| `thumb` | `Boolean` | Enable thumbnails, `false` by default. |
| `static` | `Boolean` | Are images served by the server? `true` by default. |

A config file is neccecary, althoug it can only contain `{}`. If that is so, the default options will be used (Not recomended).

#### Robots.txt

If you want to add a `robots.txt` file, add a `robots.txt` file to the project root. The server will host it if it found.
