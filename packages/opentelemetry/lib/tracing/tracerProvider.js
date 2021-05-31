/* eslint-disable no-unused-vars */

import { getBatchSpanProcessor } from './spanProcessor';
import { buildExporter, AVAILABLE_EXPORTERS } from './exporter';
import { NodeTracerProvider } from '@opentelemetry/node';
import { registerInstrumentations, InstrumentationOption } from '@opentelemetry/instrumentation';
import { ServerInstrumentation } from './serverInstrumenation';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { SpanProcessor, } from '@opentelemetry/tracing';

//Delegate
class TracerProvider {
  constructor () {
    this.provider = new NodeTracerProvider();
    this.init();
  }

  init () {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
    this.provider.register();

    const consoleExporter = buildExporter(AVAILABLE_EXPORTERS.CONSOLE);
    const spanProcessor = getBatchSpanProcessor(consoleExporter);
    this.addSpanProcessor(spanProcessor);

    this._serverInstrumentation = new ServerInstrumentation();
    registerInstrumentations({
      instrumentation: this._serverInstrumentation.instrumentations,
      tracerProvider: this.provider
    });
    this._active = true;
    this.currentConfig = {
      active: this._active,
      current_exporters: [AVAILABLE_EXPORTERS.CONSOLE],
      exporters:
        [
          {
            exporter_type: 'console',
            config: {}
          }
        ]
    };
  }

  getCurrentConfig () {
    return JSON.parse(JSON.stringify(this.currentConfig));
  }

  /**
   * adds exporter type and config to currentConfig
   * @param {[Object]} exporter  [exporter object with exporter_type and config]
   */
  addExporterToConfig (exporter) {
    this.currentConfig.current_exporters.push(exporter.exporter_type);
    this.currentConfig.exporters.push(exporter);
  }

  /**
   * generates a span processor for exporter object containing a type and config
   * @param {[Object]} exporter  [exporter object with exporter_type and config]
   */
  generateSpanProcessorForExporter (exporter) {
    const exporterObject = buildExporter(exporter.exporter_type, exporter.config);
    const spanProcessor = getBatchSpanProcessor(exporterObject);
    tracerProviderInstance.addSpanProcessor(spanProcessor);
    this.addExporterToConfig(exporter);
  }

  /**
   * adds a spanprocessor object to the current active (default) TracerProvider
   * @param {[SpanProcessor]} exporter  [exporter object with exporter_type and config]
   */
  addSpanProcessor (spanProcessor) {
    this.provider.addSpanProcessor(spanProcessor);
  }


  /**
   * adds an instrumentation object to the current active (default) TracerProvider
   * @param {[InstrumentationOption]} instrumentationInstance  [instrumentation object]
   */
  registerInstrumentation (instrumentationInstance) {
    registerInstrumentations({
      instrumentation: [instrumentationInstance],
      provider: this.provider
    });
  }

  /**
   * disables the current tracer provider
   */
  shutdown () {
    this._active = false;
    this.provider.shutdown();
  }


  /**
   * checks if the current tracer provider is active
   */
  isAlive () {
    return this._active;
  }

  /**
   * registers the current tracer provider as the active tracer provider with the api
   */
  initializeTracer () {
    this.provider.register();
  }
}

const tracerProviderInstance = new TracerProvider();
export { tracerProviderInstance };