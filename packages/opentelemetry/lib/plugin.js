/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */

import BasePlugin from '@appium/base-plugin';
const { tracerProviderInstance } = require('./tracing/tracerProvider');

export default class OpentelemetryPlugin extends BasePlugin {
  constructor (pluginName, opts = {}) {
    super(pluginName, opts);
  }

  static async updateServer (expressApp/*, httpServer*/) { // eslint-disable-line require-await
    expressApp.post('/opentelemetry/config', OpentelemetryPlugin.setOpentelemetryConfig);
    expressApp.get('/opentelemetry/config', OpentelemetryPlugin.getOpentelemetryConfig);
    expressApp.get('/opentelemetry/status', OpentelemetryPlugin.getStatus);
  }

  static getOpentelemetryConfig (_req, res) {
    res.send(JSON.stringify(tracerProviderInstance.getCurrentConfig()));
  }

  static setOpentelemetryConfig (_req, res) {
    try {
      const opentelemetryBlob = _req.body;
      const exporterBlob = opentelemetryBlob.exporter;
      tracerProviderInstance.generateSpanProcessorForExporter(exporterBlob);
      res.send(JSON.stringify({status: 'success'}));
    } catch (error) {
      res.send(JSON.stringify({ status: 'failure', message: error.message }));
    }
  }

  static getStatus (_req, res) {
    const message = tracerProviderInstance.isAlive() ? 'active' : 'inactive';
    const returnValue = {status: message};
    res.send(JSON.stringify(returnValue));
  }
}
