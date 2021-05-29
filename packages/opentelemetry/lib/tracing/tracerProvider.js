const { getBatchSpanProcessor } = require('./spanProcessor');
const { build_exporter, available_exporters_with_default_config } = require('./exporter');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { NoopTracerProvider } = require('@opentelemetry/api');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

//Delegate
class TracerProvider {
  async constructor () {
    this.init();
  }

init() {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
    this.provider = new NodeTracerProvider();
    this.provider.register();
    
    const consoleExporter = new build_exporter(available_exporters_with_default_config.CONSOLE);
    const spanProcessor = getBatchSpanProcessor(consoleExporter);
    this.addSpanProcessor(spanProcessor);
  
    registerInstrumentations({
      instrumentation: [new HttpInstrumentation({enabled: true}), new ExpressInstrumentation({enabled: true})],
      tracerProvider: this.provider
    });
}

  static getNoopTracerProviderInstance () {
    return new NoopTracerProvider();
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
    this.provider.shutdown();
  }

  initializeTracer () {
    this.provider.register();
  }
}

const tracerProviderInstance = new TracerProvider();
export { tracerProviderInstance };