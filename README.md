# Test Server
A simple Koa server to respond to any URL and provide the results. Useful for debugging or testing webhook-style responses locally. This is a development server which is not made to run in production.

## Install
The package comes with a command line interface as well as a programmatic interface.

### CLI
```
npm install -g @kylerross/test-server
```

### API
```
npm install --save @kylerross/test-server
``` 

## CLI Usage
To start the server, run the following command:
```
test-server
```

#### Options
```
-p NUM, --port=NUM
    Port number to bind the server to.

--disable-log
    Disables logging request information to the console.

--disable-body
    Disables responding to requests with data in the response body.

-b TEXT, --custom-body=TEXT
    When the body is enabled, override the default sent JSON with the provided text.

--body-fields=LIST
    Comma-seperated list of fields to include in the response body.
    Defaults to: url, method, body, query, headers, response, app

--log-fields=LIST
    Comma-seperated list of fields to include in the log message in the console.
    Defaults to: body, query, headers

--no-colors
    Disables colors in the console-logged message.

-v, --version
    Display the CLI version and exit.

-h, --help
    Display help and exit.
```

## API Documentation
To use the programmatic API:

```js
const testServer = require('@kylerross/test-server');

// Start the server with or without options
testServer({
    //... options
});
```

### Options
The following options are available to be passed into `testServer()`.

| Option        | Type                | Description                                                                      | Default                                                            |
|---------------|---------------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------|
| port          | Number              | The port to bind the server to.                                                  | `8000`                                                             |
| ignorePaths   | Array&lt;Regexp&gt; | Path regexps to ignore requests to.                                              | `[/favicon/i, /robots\.txt/i]`                                     |
| enableLogging | Boolean             | Enables logging request data to the console.                                     | `true`                                                             |
| enableBody    | Boolean             | Enables returning request data in the response as JSON or value of `customBody`. | `true`                                                             |
| customBody    | String              | Return the provided text as the body instead of the request data JSON.           | `null`                                                             |
| colors        | Boolean             | Enables colors when logging to the console.                                      | `true`                                                             |
| bodyFields    | Array&lt;String&gt; | List of fields to display in the response body.                                  | `['url', 'method', 'body', 'query', 'headers', 'response', 'app']` |
| logFields     | Array&lt;String&gt; | List of fields to display in the log to console.                                 | `['body', 'query', 'headers']`                                     |
| parserTypes   | Array&lt;String&gt; | List of parser types to allow for bodyparser. Defaults to all.                   | `['json', 'form', 'text']`                                         |
| jsonLimit     | String              | The size limit for parsing JSON bodies.                                          | `1mb`                                                              |
| textLimit     | String              | The size limit for parsing Text bodies.                                          | `1mb`                                                              |
| formLimit     | String              | The size limit for parsing Form bodies.                                          | `56kb`                                                             |
| strictJSON    | Boolean             | Strict JSON mode accepts arrays and objects only.                                | `true`                                                             |

#### Allowed Fields
The following are the available fields that can be passed into `bodyFields` and `logFields`:

- `url` - The incoming url path (ex. ctx.originalUrl)
- `method` - The request method (ex. ctx.method)
- `body` - The parsed incoming body from koa-bodyparser (ex. ctx.request.body)
- `query` - The parsed query string from koa-qs (ex. ctx.query)
- `headers` - Incoming headers object (ex. ctx.request.headers)
- `response` - The response object from Node (ex. ctx.response)
- `app` - The app object from Koa (ex. ctx.app)

---

## License
MIT
