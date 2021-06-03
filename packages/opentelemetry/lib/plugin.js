import BasePlugin from '@appium/base-plugin';
import { tracerProviderInstance } from './tracing/tracerProvider';

const STATUS_MESSAGE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUCCESS: 'success',
  FAILURE: 'failure',
  INVALID_EXPORTER_ERROR: 'invalid exporter object'
};

export default class OpentelemetryPlugin extends BasePlugin {
  constructor (pluginName, opts = {}) {
    super(pluginName, opts);
  }

  static async updateServer (expressApp/*, httpServer*/) { // eslint-disable-line require-await
    expressApp.post('/opentelemetry/config', OpentelemetryPlugin.handleSetOpentelemetryConfig);
    expressApp.get('/opentelemetry/config', OpentelemetryPlugin.handleGetOpentelemetryConfig);
    expressApp.get('/opentelemetry/status', OpentelemetryPlugin.handleGetStatus);
  }

  static handleGetOpentelemetryConfig (req, res) {
    return res.send(JSON.stringify(tracerProviderInstance.getCurrentConfig()));
  }

  static handleSetOpentelemetryConfig (req, res) {
    const opentelemetryBlob = req.body;
    const exporterConfig = opentelemetryBlob.exporter;
    if (!exporterConfig) {
      const response = JSON.stringify({ status: STATUS_MESSAGE.FAILURE, message: STATUS_MESSAGE.INVALID_EXPORTER_ERROR });
      return res.send(response);
    }
    try {
      tracerProviderInstance.registerExporter(exporterConfig);
      res.send(JSON.stringify({ status: STATUS_MESSAGE.SUCCESS }));
    } catch (error) {
      res.send(JSON.stringify({ status: STATUS_MESSAGE.FAILURE, message: error.message }));
    }
  }

  static handleGetStatus (req, res) {
    const message = tracerProviderInstance.isAlive() ? STATUS_MESSAGE.ACTIVE : STATUS_MESSAGE.INACTIVE;
    res.send(JSON.stringify({ status: message }));
  }
}
