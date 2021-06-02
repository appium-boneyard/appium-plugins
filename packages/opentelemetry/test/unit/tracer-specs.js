/* eslint-disable no-unused-vars */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

chai.use(chaiAsPromised);
const should = chai.should();

import { Tracer } from '../../lib/tracing/tracer';
import { tracerProviderInstance } from '../../lib/tracing/tracerProvider';
const tracerProviderInstanceMock = sinon.mock(tracerProviderInstance);

describe('Tracer', function () {
  const tracer = new Tracer(tracerProviderInstanceMock);

  it('should return a monkepatched async function for an async original function', function () {
    const spannerFunction = tracer.instrumentAsyncMethod('test', async () => {});
    spannerFunction.should.be.instanceOf(Function);
  });
  it('should return a monkepatched  function for an original function', function () {
    const spannerFunction = tracer.instrumentMethod('test', () => {});
    spannerFunction.should.be.instanceOf(Function);
  });
});