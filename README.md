# Koa API with Proxy

This is a fairly simple skeleton for creating an API with a proxy feature,
where the proxying of requests can be made to a configurable list of APIs.

It is written for the [Koa JS](http://koajs.com) framework and
released under the GPL v3.

## Install

Clone the repo, then get the dependencies:

```sh
npm install
```

## Run

```sh
npm run start
```

## Features

### Returned data format

The returned data will be a JSON object, and depending on whether or not
it encountered an error, it will have one of the two following forms.

#### Successful response example

```json
{
  "status": "ok",
  "statusCode": 200,
  "data": { "data from target": "in this sub-object" }
}
```

#### Error response example

```json
{
  "status": "error",
  "statusCode": 404,
  "message": { "error from target": "in this sub-object" }
}
```

### Configurable proxy list

The `config.json` file contains an array of proxies to make available.

The settings each proxy should have are:

*   **prefix** - This is the equivalent of a *route* for the request,
    e.g. `/proxy-to-other-api`

*   **target** - If defined, this is the base URL to proxy to.
    Anything appended to *prefix* is appended
    to this *target* URL when proxied.
    **NOTE**: If you don't define a target, it is assumed that the
    url supplied (after the prefix) is the full target, URI encoded.

*   **mustContain** - \[OPTIONAL\] - If you don't define a *target*,
    then you should set this to be part of the expected URL,
    so you're not just a completely open proxy.

#### Example `config.json`

```json
{
  "proxy": [
    {
      "prefix": "/elasticsearch",
      "mustContain": "/_cluster/health"
    },
    {
      "prefix": "/github-users",
      "target": "https://api.github.com/users"
    }
  ],
  "port": 3000
}
```

### CORS Headers

We set CORS headers to allow HEAD and GET requests from anywhere.
You can of course narrow this down as you see fit.

### Caching

We send `Cache-Control` and `Expires` headers to the requester.
The expiry is set to `180` seconds (three minutes), but you can change that.

### Timeout

We wait a max of `5000`ms (5 seconds) for proxied requests.
Otherwise, we might wait for minutes (for TCP timeout).
This setting can be tuned in `proxy.js`.

## Contributing

Please feel free to improve this - it's a very basic skeleton right now.

## Credits

The initial base of this was based on a code
snippet supplied by [Manuel Vila](https://github.com/mvila)

## License

Copyright (C) 2015  Frode Egeland

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
