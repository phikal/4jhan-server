## 4jhan node.js server

*v0.1, by phikal*

4jhan, inspired by 4chan, is a minimal server-client network, where a board (/b/, /g/, /pol/,...) are hosted on individual servers.

This is one implementation for the server software and it is lightweight enough to be run on a Raspberry Pi. It requires node.js and was tested on Linux. This is open and unfinished software, expect errors.

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
{
    "id" : $id,
    "name" : $name,
    "text" : $text,
    "img" : $img,
    "op" : $op_id,
    "upload" : $upload,
    "thread" : [
        {
            
        },
        ...
    ]
}
    ```

    To get the image path the client combines the searches for this path (where `upload` is from `GET:/`'s `upload`): `$(server)/c$(upload)/$(id)_$(img)`

* **`POST:/img/$img`**

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

### Configuration options:

The default configuration file is `config.json`.

* `db` String

    Database to be used.
    
    **Options**
    
    * `mysql`
    * `mongo`
    * `sqlite` (default)

* `user` String

    MySQL user name (`db` == `mysql` only)

* `pass` String

    MySQL password (`db` == `mysql` only)

* `host` String

    For `mysql`: MySQL host, default: "localhost".
        
    For `mongo`: Mongo DB host, database, etc.
        
    For `sqlite`: Ignored.
 
* `name` String

    Set server name, default: "Nameless 4jahn server"

* `short` String

    Set short identifier, not unique. Default: "z"

* `admin` String

    Set admin name

* `discr` String

    A short server description (Usage, kind, etc. ). Default: "A 4jhan server"

* `nsfw` Boolean

    Is save for work, default: `false`

* `timeout` Integer

    After how many minuets should a post be deleted? default: `60`

* `lang` String

    Used language, default: "English"

* `pass` String

    Password to access server, default: none (free for all)
    
    HTTP Basic Auth used for authentication

* `page` Integer

    Posts per page, default: none
    Pages accessed via `GET:/list?page={number}`
    If unset, all pages will be displayed at once

* `image` Boolean

    Force image for all posts, default: `true`

* `log` Boolean

    Log server requests (morgan used), default: `false`

* `extra` String

    Extra notes for `GET:/`, default: none

* `upload` String

    Upload directory for images, default : `./img/{file}`
    
    Change not recommended.

* `file` Array

    A list of accepted file types. Default: [ 'png', 'jpg', 'gif' ]

License: GPL
