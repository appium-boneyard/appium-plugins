/* eslint-disable no-unused-vars */

import { TraceAPI as api, SpanStatusCode, SpanOptions } from '@opentelemetry/api';

import { Span } from '@opentelemetry/tracing';

class Tracer {

  constructor (tracerProviderInstance, name, options = {}) {
    this.tracingProvider = tracerProviderInstance;
    const { version } = options;
    this._tracer = api.trace.getTracer(name, version);
  }

  /**
 * creates a span object with optional parent span and optional span options
 *
 *
 * @param { string } name  [name of the span]
 * @param { Span } parentSpan [(Optional) parentSpan to get context from]
 * @param { SpanOptions } spanOptions [(Optional) span options]
 * @return { Span }
 */
  createSpanObject (name, parentSpan = null, spanOptions = null) {
    //TODO - verify setting context from parentSpan
    const context = parentSpan ? api.setSpan(api.context.active(), parentSpan) : null;
    return this._tracer.startSpan(name, spanOptions, context);
  }


  /**
 * monkeypathces argument async function to instrument it via a span object
 *
 *
 * @param { string } name  [name of the span]
 * @param { Function } fn [original function to monkeypatch]
 * @param { Span } parentSpan [(Optional) parentSpan to get context from]
 * @param { SpanOptions } spanOptions [(Optional) span options]
 * @return { Function }
 */
  instrumentAsyncMethod (name, fn, parentSpan = null, spanOptions = null) {
    const spannerFunction = async (...args) => {
      const span = this.createSpanObject(name, parentSpan, spanOptions);
      try {
        const ret = await fn.call(...args);
        span.end();
        return ret;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message
        });
        throw error;
      } finally {
        span.end();
      }
    };
    return spannerFunction;
  }

  /**
 * monkeypathces argument function to instrument it via a span object
 *
 *
 * @param { string } name  [name of the span]
 * @param { Function } fn [original function to monkeypatch]
 * @param { Span } parentSpan [(Optional) parentSpan to get context from]
 * @param { SpanOptions } spanOptions [(Optional) span options]
 * @return { Function }
 */
  instrumentMethod (name, fn, parentSpan = null, spanOptions = null) {
    const spannerFunction = (...args) => {
      const span = this.createSpanObject(name, parentSpan, spanOptions);
      try {
        const ret = fn.call(...args);
        span.end();
        return ret;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message
        });
        throw error;
      } finally {
        span.end();
      }
    };
    return spannerFunction;
  }

  get tracerInstance () {
    return this._tracer;
  }
}

export { Tracer };

