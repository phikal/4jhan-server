## 4jhan node.js server

*v0.1, by phikal*

### To start server , type

**`$ ./bin/www`**

---

### Paths:

* **`GET:/`**

    Get server info as JSON Object. Related with `config.json`, definitions below.

* **`GET:/list`**

    JSON array of posts.

    Built up like this:

    ```
[
    {
        "id" : $id,
        "title" : $title,
        "name" : $name,
        "text" : $text,
        "img" : $img,
        "upload" $upload
    },
    ...
]
    ```

    To get the image path the client combines the searches for this path (where `upload` is from `GET:/`'s `upload`): `$(server)/$(upload)/$(id)_$(img)`

    If `name` is undefined, use `GET:/`'s `anon`

* **`GET:/thread/$id`**

    A JSON list of replies to a post.

    Built up like this:

    ```
[
    {
        "id" : $id,
        "name" : $name,
        "text" : $text,
        "img" : $img,
        "op" : $op_id,
        "upload" : $upload
    },
    ...
]
    ```

    To get the image path the client combines the searches for this path (where `upload` is from `GET:/`'s `upload`): `$(server)/c$(upload)/$(id)_$(img)`

* **POST:/img/$img**

    Returns image file.

* **`POST:/upload`**

    A `multipart/form-data` form.

    **Required:**

    * `text` String

        Containing OP text.

    * `file` File

        The uploaded file

    **Optional:** (Self explanatory)

    * `title` String
    * `name` String

    The URL variable `url` can be added to redirect user after upload is complete.

* **`POST:/comment`**

    The same as `POST/upload`, except for:

    * `file` is optional
    * `op` is required, and contains the post id
    * `title` is ignored

If `pass` is set in config (see below), all paths (except `GET:/`) have to be accessed with `?pass=$password` added to the URL.

---

### Configuration opts:

The default config file is `config.json`.

* `db` String

    Database to be used.
    
    **Options**
    
    * `mysql`
    * `mongo`
    * `sqlite` (default)


* `config.user` String

    MySQL user name (`db` == `mysql` only)

* `config.pass` String

    MySQL password (`db` == `mysql` only)

* `config.host` String

    If `db` == `mysql`: MySQL host, default: "localhost".
        
    If `db` == `mongo`: Mongo DB host, database, etc.
        
    If `db` == `sqlite`: Ignored.
 
* `config.name` String

    Set server name, default: "Nameless 4jahn server"

* `config.short` String

    Set short identifier, not unique. Default: "/x/"

* `config.admin` String

    Set admin name, default `config.anon` or if unset: "Anonymous"

* `config.discr` String

    A Short server description (Usage, kind, etc. ). Default: "A 4jhan server"

* `config.nsfw` Boolean

    Is save for work, default: `false`

* `config.timeout` Integer

    After how many minuets should a post be deleted? default: `60`

* `config.lang` String

    Used language, default: "English"

* `config.pass` String

    Password to access server, default: none (free for all)
    
    HTTP Basic Auth used for authentication

* `config.page` Integer

    Posts per page, default: none
    Pages accessed via `GET:/list?page={number}`
    If unset, all pages will be displayed at once

* `config.image` Boolean

    Force image for all posts, default: `true`

* `config.log` Boolean

    Log server requests (morgan used), default: `false`

* `config.extra` String

    Extra notes for `GET:/`, default: none

* `config.upload` String

    Upload directory for images, default : `./img/{file}`

* `config.file` Array

    A list of accepted file types. Default: [ 'png', 'jpg', 'gif' ]

License: GPL
