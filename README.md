# Koa API with Proxy

This is a very simple skeleton for creating an API with a proxy feature,
where the proxying of requests can be made to a configurable list of APIs.

It is written for the Koa JS framework.

## Install

Clone the repo, then get the dependencies:

```
npm install
```

## Features

### Configurable proxy list

The `config.json` file contains a list of proxies to make available.
This is hopefully self-explanatory.

### CORS Headers

We set CORS headers to allow HEAD and GET requests from anywhere.
You can of course narrow this down as you see fit.

### Caching

We send `Cache-Control` and `Expires` headers to the requester.
The expiry is set to `180` seconds (three minutes), but you can change that.

## Contributing

Please feel free to improve this - it's a very basic skeleton right now.

## Credits

The initial base of this was from a code snippet supplied by [Manuel Vila](https://github.com/mvila)


