/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */

import BasePlugin from '@appium/base-plugin';
import B from 'bluebird';

export default class OpentelemetryPlugin extends BasePlugin {
  constructor (pluginName, opts = {}) {
    super(pluginName, opts);
  }

  static newMethodMap = {
    '/opentelemetry/config': {
      POST: {command: 'setOpentelemetryConfig', payloadParams: {required: ['data']}}
    },
    '/opentelemetry/status': {
      GET: {command: 'getStatus'}
    },
  };

  async getStatus (_next, _driver) {
    await B.delay(10);
    return `${JSON.stringify('{"status" : "OK"}')}`;
  }

  async setOpentelemetryConfig (_next, _driver, ...args) {
    await B.delay(10);
    // eslint-disable-next-line no-console
    console.log(args);
  }
}
