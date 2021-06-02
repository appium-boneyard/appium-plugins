/* eslint-disable no-unused-vars */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { tracerProviderInstance } from '../../lib/tracing/tracerProvider';

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

describe('TracerProvider', function () {
  beforeEach(async function () {
    await tracerProviderInstance.reset();
  });
  after (async function () {
    await tracerProviderInstance.shutdown();
    await tracerProviderInstance.provider.shutdown();
  });
  it('should return current config', function () {
    const expectedConfig = {
      active: true,
      exporters: [{ exporterType: 'console'}]
    };
    expect(tracerProviderInstance.currentConfig).to.deep.equal(expectedConfig);
  });
  it('should generate span processor with specific exporter object', function () {
    const exporterConfig = {
      exporterType: 'zipkin',
      config: {}
    };
    tracerProviderInstance.registerExporter(exporterConfig);
    const expectedConfig = {
      active: true,
      exporters: [
        { exporterType: 'console'},
        { exporterType: 'zipkin', config: {} }
      ]
    };
    expect(tracerProviderInstance.currentConfig).to.deep.equal(expectedConfig);
  });
  it('should disable tracer', async function () {
    const expectedConfig = {
      active: false,
      exporters: []
    };
    await tracerProviderInstance.shutdown();
    expect(tracerProviderInstance.currentConfig).to.deep.equal(expectedConfig);
  });
  it('should disable exporter', async function () {
    const exporterConfig = {
      exporterType: 'zipkin',
      config: {}
    };
    tracerProviderInstance.registerExporter(exporterConfig);
    await tracerProviderInstance.disableExporter(exporterConfig.exporterType);
    const expectedConfig = {
      active: true,
      exporters: [{ exporterType: 'console'}]
    };
    expect(tracerProviderInstance.currentConfig).to.deep.equal(expectedConfig);
  });
});