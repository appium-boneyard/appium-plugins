/* eslint-disable no-unused-vars */

import { getBatchSpanProcessor } from './spanProcessorFactory';
import { buildExporter, AVAILABLE_EXPORTERS } from './exporterFactory';
import { NodeTracerProvider } from '@opentelemetry/node';
import { registerInstrumentations, InstrumentationOption } from '@opentelemetry/instrumentation';
import { ServerInstrumentation } from './serverInstrumenation';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { SpanProcessor } from '@opentelemetry/tracing';
import { ExporterConfig } from '@opentelemetry/exporter-jaeger';
import _ from 'lodash';
import { forEachPromise } from '../utils';

//Delegate
class TracerProvider {
  constructor () {
    this.provider = new NodeTracerProvider();
    this.exporters = {};
    this._currentConfig = {
      active: true,
      exporters: []
    };
    this.init();
  }

  /**
   * @typedef {Object} exporter
   * @property {string} exporterType - exporterType of the exporter
   * @property {ExporterConfig} config - config for that specific exporterType
    */

  init () {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
    this.provider.register();

    this._serverInstrumentation = new ServerInstrumentation();
    registerInstrumentations({
      instrumentation: this._serverInstrumentation.instrumentations,
      tracerProvider: this.provider
    });

    this.registerExporter({
      exporterType: AVAILABLE_EXPORTERS.CONSOLE
    });
  }

  get currentConfig () {
    return _.cloneDeep(this._currentConfig);
  }

  /**
   * adds exporter type and config to currentConfig
   * @param {exporter} exporter  exporter object with exporterType and config
   */
  addExporter (exporterObject, exporter) {
    this.exporters[exporter.exporterType] = exporterObject;
    this._currentConfig.exporters.push(exporter);
  }

  /**
   * generates a span processor for exporter object containing a type and config
   * @param {Object} exporter  exporter object with exporterType and config
   */
  registerExporter (exporter) {
    const exporterObject = buildExporter(exporter.exporterType, exporter.config);
    const spanProcessor = getBatchSpanProcessor(exporterObject);
    this.addSpanProcessor(spanProcessor);
    this.addExporter(exporterObject, exporter);
  }

  /**
   * adds a spanprocessor object to the current active (default) TracerProvider
   * @param {SpanProcessor} spanProcessor  exporter object with exporterType and config
   */
  addSpanProcessor (spanProcessor) {
    this.provider.addSpanProcessor(spanProcessor);
  }

  /**
   * adds an instrumentation object to the current active (default) TracerProvider
   * @param {[InstrumentationOption]} instrumentationInstance  instrumentation object
   */
  registerInstrumentation (instrumentationInstance) {
    registerInstrumentations({
      instrumentation: [instrumentationInstance],
      provider: this.provider
    });
  }

  /**
   * disables existing exporter if active
   * @param {string} exporterType exporter types from AVAILABLE_EXPORTERS
   */
  async disableExporter (exporterType) {
    if (this.exporters[exporterType]) {
      await this.exporters[exporterType].shutdown();
      delete this.exporters[exporterType];
    }
    this._currentConfig.exporters = this._currentConfig.exporters.filter(function (item) {
      return item.exporterType !== exporterType;
    });
  }

  /**
   * disables the current tracer provider
   */
  async shutdown () {
    this._currentConfig.active = false;
    const exporterList = Object.keys(this.exporters);
    await forEachPromise(exporterList, async (exporterType) => {
      await this.disableExporter(exporterType);
    });
  }

  /**
   * checks if the current tracer provider is active
   */
  isAlive () {
    return this.currentConfig.active;
  }

  /**
   * registers the current tracer provider as the active tracer provider with the api
   */
  initializeTracer () {
    this.provider.register();
  }

  async reset () {
    const exporterList = Object.keys(this.exporters);
    await forEachPromise(exporterList, async (exporterType) => {
      await this.disableExporter(exporterType);
    });
    this.registerExporter({
      exporterType: AVAILABLE_EXPORTERS.CONSOLE
    });
    this._currentConfig.active = true;
  }
}

const tracerProviderInstance = new TracerProvider();
export { tracerProviderInstance };