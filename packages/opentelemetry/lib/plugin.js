/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */

import BasePlugin from '@appium/base-plugin';
import { tracerProviderInstance } from './tracing/tracerProvider';

const constants = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUCCESS: 'success',
  FAILURE: 'failure'
};

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
    const opentelemetryBlob = _req.body;
    try {
      const exporterBlob = opentelemetryBlob.exporter;
      tracerProviderInstance.generateSpanProcessorForExporter(exporterBlob);
      res.send(JSON.stringify({status: constants.SUCCESS}));
    } catch (error) {
      res.send(JSON.stringify({ status: constants.FAILURE, message: error.message }));
    }
  }

  static getStatus (_req, res) {
    const message = tracerProviderInstance.isAlive() ? constants.ACTIVE : constants.INACTIVE;
    res.send(JSON.stringify({status: message}));
  }
}
