const jagger = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { ConsoleSpanExporter } = require('@opentelemetry/tracing');

const DEFAULT_SERVICE_NAME = 'appium'

const available_exporters_with_default_config = {
    JAGGER : 'jagger',
    ZIPKIN : 'zipkin',
    PROMETHEUS: 'prometheus',
    CONSOLE: 'console'
}

const build_exporter = function(exporter_type, config=undefined) {
    switch(exporter_type){
        case available_exporters_with_default_config.JAGGER:
            config = config || { serviceName: DEFAULT_SERVICE_NAME };
            return new jagger.JaegerExporter(config);
        case available_exporters_with_default_config.ZIPKIN:
            config = config || { serviceName: DEFAULT_SERVICE_NAME };
            return new ZipkinExporter(config);
        case available_exporters_with_default_config.PROMETHEUS:
            return new PrometheusExporter(config);
        case available_exporters_with_default_config.CONSOLE:
            return new ConsoleSpanExporter();
    }
    throw new Error(`Unsupported exporter type - ${exporter_type}`);
}

export { build_exporter, available_exporters_with_default_config };