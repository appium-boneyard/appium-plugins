const { getBatchSpanProcessor } = require('./spanProcessor');
const { buildExporter, AVAILABLE_EXPORTERS } = require('./exporter');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ServerInstrumentation } = require('./serverInstrumenation');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

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
      instrumentation: this._serverInstrumentation.getInstrumentations(),
      tracerProvider: this.provider
    });
    this._active = true;
    this.currentConfig = {
      active: this._active,
      exporters: [AVAILABLE_EXPORTERS.CONSOLE]
    };
  }

  getCurrentConfig () {
    return this.currentConfig;
  }

  generateSpanProcessorForExporter (exporter) {
    const exporterObject = buildExporter(exporter.exporter_type, exporter.config);
    const spanProcessor = getBatchSpanProcessor(exporterObject);
    tracerProviderInstance.addSpanProcessor(spanProcessor);
    this.currentConfig.exporters.push(exporter.exporter_type);
  }

  addSpanProcessor (spanProcessor) {
    this.provider.addSpanProcessor(spanProcessor);
  }

  registerInstrumentation (instrumentationInstance) {
    registerInstrumentations({
      instrumentation: [instrumentationInstance],
      provider: this.provider
    });
  }

  shutdown () {
    this._active = false;
    this.provider.shutdown();
  }

  isAlive () {
    return this._active;
  }

  initializeTracer () {
    this.provider.register();
  }
}

const tracerProviderInstance = new TracerProvider();
export { tracerProviderInstance };