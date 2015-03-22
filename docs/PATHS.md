## Paths

These are the paths that the server hosts and the client accesses.

#### `GET:/`

The server information formated as as JSON object:

| **name** | **type** | **description** | **default** |
|----------|----------|-----------------|-------------|
| `name`   | `String` | Server name     | `Nameless 4jhan server` |
| `short`  | `String` | Short server name  | `z` |
| `admin`  | `String` | Admin pseudonym/name | |
| `discription` | `String` | Server description (f.e.: What is server for? What kind?) | `A 4jhan server` |
| `nsfw`   | `Boolean`| Is not server safe for work? | `false` |
| `timeout` | `Number` | After how many minutes are posts deleted? | `60` |
| `language` | `String` | Language used on server | `English` |
| `version` | `String` | Server version |  |
| `database` | `String` | Database used for server | `sqlite` |
| `page` | `Number` | Are pages used and items per page | |
| `imageForce` | `Boolean` | Do posts require images. Can turn board into text board. | `true` |
| `uptime` | `String` | Date on which server was started, [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) | |
| `extra` | `String` | Extra description (rules, attribution, nonsense) | |
| `files` | `Array`  | Allowed file types | ` [ 'png', 'jpg', 'gif' ] ` |
| `tripcode` | `Boolean` | Are tripcodes enabled?| `true` |

Some values may not be hosted, f.e.: `page`. If that is so, they are ignored (no pages)

#### `GET:/list`

A JSON array of posts
This is one post:

| **name** | **type** | **description** |
|----------|----------|-----------------|
| `id`     | `String` | The ID of the post. |
| `title`  | `String` | The title of the post, can be undefined |
| `name`   | `String` | OP's pseudonym |
| `text`   | `String` | The posts text |
| `img`    | `String` | An image attached to the post, can be found in `/img/$img` |
| `upload` | `String` | The post upload date, [RFC 822 format](https://www.ietf.org/rfc/rfc0822.txt) |
| `tripcode` | `String` | Commenter's tripcode authentication |

#### `GET:/thread/$id`

A JSON object contining a post and its comments.
It is built up just like the table above,
the only difference is an extra `thread` array, containing the comments.

This is one comment:

| **name** | **type** | **description** |
|----------|----------|-----------------|
| `id`     | `String` | The ID of the comment |
| `name`   | `String` | Commenter's pseudonym |
| `text`   | `String` | The comments text |
| `img`    | `String` | An image attached to the post, can be found in `GET:/img/$img` |
| `upload` | `String` | The post upload date, [RFC 822 format](https://www.ietf.org/rfc/rfc0822.txt) |
| `tripcode` | `String` | Commenter's tripcode authentication |

The server may or may not send extra values, depending on the database used. These can be ignored.

##### `GET:/img/$img`

Returns image file `$img`.

##### `GET:/thumb/$thumb`

If thumbnails are enabled, this path will return a compressed version of `GET:/img/$thumb`, but if not, it will return the same as `GET:/img/$img`.

##### `POST:/upload`

A `multipart/form-data` form used for uploading posts.

| **name** | **type** | **description** |
|----------|----------|-----------------|
| `text`   | `String` | Containing post text. |
| `file`   | `File`   | *file-to-upload*, <1MB. |
| `title`  | `String` | Post title |
| `name`   | `String` | OP's pseudonym, format: `name#password` |
| `url`    | `String` | An URL, to which the user will be redirected after upload. Optional |

##### `POST:/comment`

| **name** | **type** | **description** |
|----------|----------|-----------------|
| `text`   | `String` | Containing post text. |
| `file`   | `File`   | *file-to-upload*, <1MB. Optional |
| `name`   | `String` | Commenter's pseudonym, format: `name#password`|
| `url`    | `String` | An URL, to which the user will be redirected after upload. Optional |
| `op`     | `String` | ID of the post to add comment to. |
