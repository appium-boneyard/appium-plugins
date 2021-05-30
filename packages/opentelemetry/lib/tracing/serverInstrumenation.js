const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

class ServerInstrumentation {
  constructor () {
    this._httpInstrumentation = new HttpInstrumentation();
    this._expressInstrumentation = new ExpressInstrumentation();
    this._ignoreIncomingPaths = [],
    this._ignoreOutgoingUrls = [],
    this._httpCurrentConfig = {
      ignoreIncomingPaths: this._ignoreIncomingPaths,
      ignoreOutgoingUrls: this._ignoreOutgoingUrls,
      applyCustomAttributesOnSpan: {},
      requestHook: undefined,
      responseHook: undefined,
      serverName: undefined
    };
  }

  updateCurrentConfig () {
    this._httpInstrumentation.setConfig(this._httpCurrentConfig);
  }

  getInstrumentations () {
    return [this._httpInstrumentation, this._expressInstrumentation];
  }

  /**
 * Optionally add a ignore string or a regex to avoid instrumenting that incoming path which matches the string or regex
 *
 *
 * @param { path } string | RegExp  - the incoming path to be ignored
 */
  addIncomingIgnoreMatchers (path) {
    this._ignoreIncomingPaths.append(path);
    this.updateCurrentConfig();
  }

  /**
  ** Optionally add a ignore string or a regex to avoid instrumenting that outgoing url which matches the string or regex
  *
  *
  * @param { url } string | RegExp  - the outgoing url (string or regex) to be ignored
  */

  addOutgoingUrlIgnoreMatchers (url) {
    this._ignoreOutgoingUrls.append(url);
    this.updateCurrentConfig();
  }

  /**
   * Optionally add a servername to add as an attribute to the span
   *
   *
   * @param { name } string
   */
  updateServerName (name) {
    this._httpCurrentConfig.serverName = name;
    this.updateCurrentConfig();
  }

  /**
   * Optionally add a request hook to intercept any requests and update the attributes
   *
   *
   * @param { hook } function
   */
  addRequestHook (hook) {
    this._httpCurrentConfig.requestHook = hook;
    this.updateCurrentConfig();
  }


  /**
   * Optionally add a response hook to intercept any requests and update the attributes
   *
   *
   * @param { hook } function
   */
  addResponseHook (hook) {
    this._httpCurrentConfig.responseHook = hook;
    this.updateCurrentConfig();
  }
}

export { ServerInstrumentation };