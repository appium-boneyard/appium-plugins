/* eslint-disable no-unused-vars */

import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { InstrumentationBase } from '@opentelemetry/instrumentation';
import _ from 'lodash';

class ServerInstrumentation {
  constructor () {
    this._httpInstrumentation = new HttpInstrumentation();
    this._expressInstrumentation = new ExpressInstrumentation();
    this._httpCurrentConfig = {
      ignoreIncomingPaths: [],
      ignoreOutgoingUrls: [],
      applyCustomAttributesOnSpan: {}
    };
  }

  updateCurrentConfig () {
    this._httpInstrumentation.setConfig(this._httpCurrentConfig);
  }

  /**
   * get the server instrumentation instances as an array
   *
   *
   * @return {[InstrumentationBase]}
   */
  get instrumentations () {
    return [this._httpInstrumentation, this._expressInstrumentation];
  }

  get httpCurrentConfig () {
    return _.cloneDeep(this._httpCurrentConfig);
  }

  set httpCurrentConfig (config) {
    this._httpCurrentConfig = config;
  }

  /**
   * Optionally add a ignore string or a regex to avoid instrumenting that incoming path which matches the string or regex
   *
   *
   * @param {string | RegExp} path  the incoming path to be ignored
   */
  addIncomingIgnoreMatchers (path) {
    this._httpCurrentConfig.ignoreIncomingPaths.push(path);
    this.updateCurrentConfig();
  }

  /**
   * Optionally add a ignore string or a regex to avoid instrumenting that outgoing url which matches the string or regex
   *
   *
   * @param {string | RegExp} url the outgoing url (string or regex) to be ignored
   */
  addOutgoingUrlIgnoreMatchers (url) {
    this._httpCurrentConfig.ignoreOutgoingUrls.push(url);
    this.updateCurrentConfig();
  }

  /**
   * Optionally add a servername to add as an attribute to the span
   *
   *
   * @param {string} name
   */
  updateServerName (name) {
    this._httpCurrentConfig.serverName = name;
    this.updateCurrentConfig();
  }

  /**
   * Optionally add a request hook to intercept any requests and update the attributes
   *
   *
   * @param {Function} hook
   */
  addRequestHook (hook) {
    this._httpCurrentConfig.requestHook = hook;
    this.updateCurrentConfig();
  }


  /**
   * Optionally add a response hook to intercept any requests and update the attributes
   *
   *
   * @param { Function } hook
   */
  addResponseHook (hook) {
    this._httpCurrentConfig.responseHook = hook;
    this.updateCurrentConfig();
  }
}

export { ServerInstrumentation };