# Appium Execute Driver Script Plugin

One downside of Appium's client-server architecture is that each command must travel across a network with potentially high latency. This is especially the case in situations where the Appium session takes place on a service provider's host machine rather than locally.

This command enables the batching of many commands together, to be executed in one go on the Appium server. The way this is accomplished is on the model of `executeScript`: the client will send in a string representing code to be executed. The Appium server will execute that code in the context of the current session, and return any values specified by the script.

## Prerequisites

* Appium Server 2.0+

## Installation - Server

Install the plugin using Appium's plugin CLI:

```
appium plugin install execute-driver
```

## Installation - Client

No special action is needed to make the features available in the various Appium clients, as this plugin used to be a core Appium feature and its commands are already supported in the official clients.

## Activation

The plugin will not be active unless turned on when invoking the Appium server:

```
appium --use-plugins=execute-driver
```

## Usage

The command itself looks different based on the client you are using, so refer to your client docs. In WebdriverIO, for example, it would look something like:

```js
await driver.executeDriver(script, timeout, type)
```

There are three parameters accepted by this command (which may be collected by each client in its own way):
  * `script`: the string consisting of the script itself
  * `timeout`: a number representing the number of milliseconds to wait before killing the process running the driver script. Default is equivalent to 1 hour.
  * `type`: a string representing the script language/API. Currently only one type, `webdriverio`, is supported (and it is the default).

Not just any code can run in this context. The code must be written in Javascript, and it will have access to a context with three objects:
  * `driver`: a [WebdriverIO](https://webdriver.io/) driver object. It may be assumed this driver has already connected with the Appium server and is ready to run commands. The version of WebdriverIO used is the one installed according to the specification in `appium-base-driver`'s `package.json` file.
  * `console`: a custom `console` object, with methods `log`, `warn`, and `error`, so that logging may take place.
  * `Promise`: a Promise library ([Bluebird](http://bluebirdjs.com/docs/getting-started.html)), to make asynchronous work easier.

The code will be placed inside an `async` function, as below, so you are free to use `await`:

```js
(async function (driver, console, Promise) {
  // --> your script here <--
})()
```

Any errors will result in an error response to the call to this command. Any return values will be wrapped up and sent back to your client in the following form:

```js
{result: <return value>, logs: {log: [], warn: [], error: []}}
```

Using this response object you can gather the return value as well as the output of any log statements you made.

The advantage of this approach of using WebdriverIO code is that you have access to a full programming language and Appium API, and can use any language or API features you need, including loops, conditionals, and explicit waits. The WebdriverIO API cannot be enumerated here, so visit the [WebdriverIO documentation](https://webdriver.io/docs/api.html) for more info.
