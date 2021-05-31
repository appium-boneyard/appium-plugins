import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { ConsoleSpanExporter } from '@opentelemetry/tracing';

const DEFAULT_SERVICE_NAME = 'appium';

const AVAILABLE_EXPORTERS = {
  JAGGER: 'jagger',
  ZIPKIN: 'zipkin',
  PROMETHEUS: 'prometheus',
  CONSOLE: 'console'
};

function buildExporter (exporterType, config = null) {
  switch (exporterType) {
    case AVAILABLE_EXPORTERS.JAGGER:
      config = config || { serviceName: DEFAULT_SERVICE_NAME };
      return new JaegerExporter(config);
    case AVAILABLE_EXPORTERS.ZIPKIN:
      config = config || { serviceName: DEFAULT_SERVICE_NAME };
      return new ZipkinExporter(config);
    case AVAILABLE_EXPORTERS.PROMETHEUS:
      return new PrometheusExporter(config);
    case AVAILABLE_EXPORTERS.CONSOLE:
      return new ConsoleSpanExporter();
  }
  throw new Error(`Unsupported exporter type - ${exporterType}, Supported types ${Object.keys(AVAILABLE_EXPORTERS)}`);
}

export { buildExporter, AVAILABLE_EXPORTERS };