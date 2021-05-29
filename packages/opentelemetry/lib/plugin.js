/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */

import BasePlugin from '@appium/base-plugin';
const { tracerProviderInstance } = require('./tracing/tracerProvider');


export default class OpentelemetryPlugin extends BasePlugin {
  constructor (pluginName, opts = {}) {
    super(pluginName, opts);
  }

  static newMethodMap = {
    '/opentelemetry/status': {
      GET: {command: 'getStatus'}
    },
  };

  static setOpentelemetryConfig2 (_req, res) {
    //console.log("request is ", _req);
    //console.log("respones is ", res);
    console.log("call aaya");
    res.send(JSON.stringify({fake: 'fakeResponse'}));
  }

  static async updateServer (expressApp/*, httpServer*/) { // eslint-disable-line require-await
    expressApp.all('/opentelemetry/config', OpentelemetryPlugin.setOpentelemetryConfig2);
  }

  async getStatus (_next, _driver) {
    return `${JSON.stringify('{"status" : "OK"}')}`;
  }
}
