## Configuration

The configuration file is `config.json`. It has to be places in the root project directory.

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