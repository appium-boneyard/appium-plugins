/* eslint-disable no-unused-vars */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { getBatchSpanProcessor, getSimpleSpanProcessor } from '../../lib/tracing/spanProcessorFactory';
import { ConsoleSpanExporter, SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/tracing';


chai.use(chaiAsPromised);
const should = chai.should();


describe('SpanProcessorFactory', function () {
  it('should return a simple span processor instance', function () {
    const exporterMock = sinon.mock(ConsoleSpanExporter);
    getSimpleSpanProcessor(exporterMock).should.be.instanceOf(SimpleSpanProcessor);
    exporterMock.restore();
  });
  it('should return a batch span processor instance', function () {
    const exporterMock = sinon.mock(ConsoleSpanExporter);
    getBatchSpanProcessor(exporterMock).should.be.instanceOf(BatchSpanProcessor);
    exporterMock.restore();
  });
});