/* eslint-disable no-unused-vars */

import { ServerInstrumentation } from '../../lib/tracing/serverInstrumenation';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { InstrumentationBase } from '@opentelemetry/instrumentation';

chai.use(chaiAsPromised);
const should = chai.should();

describe('ServerInstrumentation', function () {
  it('should exist', function () {
    should.exist(ServerInstrumentation);
  });
  it('should create an instance of ServerInstrumentation', function () {
    const instance = new ServerInstrumentation();
    should.exist(instance);
  });
  it('should get the server instrumentations as a list', function () {
    const instrumentations = new ServerInstrumentation().instrumentations;
    should.exist(instrumentations);
    instrumentations.should.have.length(2);
    instrumentations[0].should.be.instanceOf(InstrumentationBase);
    instrumentations[1].should.be.instanceOf(InstrumentationBase);
  });
  it('should add ignore matcher string for the path', function () {
    const serverInstrumentation = new ServerInstrumentation();
    serverInstrumentation.addIncomingIgnoreMatchers('/wd/hub');
    serverInstrumentation.httpCurrentConfig.ignoreIncomingPaths.should.include('/wd/hub');
  });
  it('should add ignore matcher regex for the path', function () {
    const serverInstrumentation = new ServerInstrumentation();
    const testingRegex = new RegExp('/wd/hub');
    serverInstrumentation.addIncomingIgnoreMatchers(testingRegex);
    serverInstrumentation.httpCurrentConfig.ignoreIncomingPaths[0].should.be.instanceOf(RegExp);
  });
  it('should add server name to the config', function () {
    const serverInstrumentation = new ServerInstrumentation();
    should.not.exist(serverInstrumentation.httpCurrentConfig.serverName);
    serverInstrumentation.updateServerName('appium');
    serverInstrumentation.httpCurrentConfig.serverName.should.eql('appium');
  });
  it('should add request and response hook function', function () {
    const serverInstrumentation = new ServerInstrumentation();
    should.not.exist(serverInstrumentation.httpCurrentConfig.responseHook);
    should.not.exist(serverInstrumentation.httpCurrentConfig.requestHook);
    serverInstrumentation.addRequestHook(() => {});
    serverInstrumentation.addResponseHook(() => {});
    serverInstrumentation.httpCurrentConfig.requestHook.should.be.instanceOf(Function);
    serverInstrumentation.httpCurrentConfig.responseHook.should.be.instanceOf(Function);
  });
});