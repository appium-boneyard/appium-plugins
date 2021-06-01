import BasePlugin from '@appium/base-plugin';
import { tracerProviderInstance } from './tracing/tracerProvider';

const STATUS_MESSAGE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUCCESS: 'success',
  FAILURE: 'failure',
  INVALID_EXPORTER_ERROR_MESSAGE: 'invalid exporter object'
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

  static getOpentelemetryConfig (req, res) {
    return res.send(JSON.stringify(tracerProviderInstance.getCurrentConfig()));
  }

  static setOpentelemetryConfig (req, res) {
    const opentelemetryBlob = req.body;
    const exporterBlob = opentelemetryBlob.exporter;
    if (!exporterBlob) {
      return res.send(JSON.stringify({ status: STATUS_MESSAGE.FAILURE, message: STATUS_MESSAGE.INVALID_EXPORTER_ERROR_MESSAGE }));
    }
    try {
      tracerProviderInstance.generateSpanProcessorForExporter(exporterBlob);
      res.send(JSON.stringify({ status: STATUS_MESSAGE.SUCCESS }));
    } catch (error) {
      res.send(JSON.stringify({ status: STATUS_MESSAGE.FAILURE, message: error.message }));
    }
  }

  static getStatus (req, res) {
    const message = tracerProviderInstance.isAlive() ? STATUS_MESSAGE.ACTIVE : STATUS_MESSAGE.INACTIVE;
    res.send(JSON.stringify({ status: message }));
  }
}
