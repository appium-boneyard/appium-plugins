const api = require('@opentelemetry/api');
const { SpanStatusCode } = require('@opentelemetry/api');

class Tracer {

  constructor (tracerProviderInstance, name, options = {}) {
    this.tracingProvider = tracerProviderInstance;
    const { version } = options;
    this._tracer = api.trace.getTracer(name, version);
  }

  createSpanObject (name, parentSpan = undefined, spanOptions = undefined) {
    //TODO - verify setting context from parentSpan
    const context = parentSpan ? api.setSpan(api.context.active(), parentSpan) : undefined;
    const span = this._tracer.startSpan(name, spanOptions, context);
    return span;
  }

  instrumentAsyncMethod (name, fn, parentSpan = undefined, spanOptions = undefined) {
    const spannerFunction = async (...args) => {
      const span = this.createSpanObject(name, parentSpan, spanOptions);
      try {
        let ret = await fn.call(args);
        span.end();
        return ret;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message
        });
        throw error;
      }
    };
    return spannerFunction;
  }

  instrumentMethod (name, fn, parentSpan = undefined, spanOptions = undefined) {
    const spannerFunction = (...args) => {
      const span = this.createSpanObject(name, parentSpan, spanOptions);
      try {
        let ret = fn.call(args);
        span.end();
        return ret;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message
        });
        throw error;
      }
    };
    return spannerFunction;
  }

  getRawTracerInstance () {
    return this._tracer;
  }
}

export { Tracer };

