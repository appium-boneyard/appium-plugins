import { SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/tracing';

function getSimpleSpanProcessor (spanExporter) {
  return new SimpleSpanProcessor(spanExporter);
}

const defaultBatchSpanProcessorConfig = {
  maxExportBatchSize: 100,
  /** The delay interval in milliseconds between two consecutive exports.
     *  The default value is 5000ms. */
  scheduledDelayMillis: 5000,
  /** How long the export can run before it is cancelled.
     * The default value is 30000ms */
  exportTimeoutMillis: 30000,
  /** The maximum queue size. After the size is reached spans are dropped.
     * The default value is 2048. */
  maxQueueSize: 2048
};

//optimized to batch spans and send it together
function getBatchSpanProcessor (spanExporter, options = defaultBatchSpanProcessorConfig) {
  return new BatchSpanProcessor(spanExporter, options);
}

export { getSimpleSpanProcessor, getBatchSpanProcessor };