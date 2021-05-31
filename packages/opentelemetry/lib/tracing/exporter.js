/* eslint-disable no-unused-vars */

import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { ConsoleSpanExporter, SpanExporter } from '@opentelemetry/tracing';


const DEFAULT_SERVICE_NAME = 'appium';

const AVAILABLE_EXPORTERS = {
  JAGGER: 'jagger',
  ZIPKIN: 'zipkin',
  PROMETHEUS: 'prometheus',
  CONSOLE: 'console'
};

/**
   * factory to create exporter instance for a given exporter type and optional config
   * @param {string} exporterType
   * @param {Object} config
   * @return {SpanExporter}
   * @throws Will throw an error if the exporter_type is invalid or null
   */
function buildExporter (exporterType, config = null) {
  switch (exporterType) {
    case AVAILABLE_EXPORTERS.JAGGER:
      return new JaegerExporter(config || { serviceName: DEFAULT_SERVICE_NAME });
    case AVAILABLE_EXPORTERS.ZIPKIN:
      return new ZipkinExporter(config || { serviceName: DEFAULT_SERVICE_NAME });
    case AVAILABLE_EXPORTERS.PROMETHEUS:
      return new PrometheusExporter(config);
    case AVAILABLE_EXPORTERS.CONSOLE:
      return new ConsoleSpanExporter();
  }
  throw new Error(`Unsupported exporter type - ${exporterType}, Supported types ${Object.keys(AVAILABLE_EXPORTERS)}`);
}

export { buildExporter, AVAILABLE_EXPORTERS };