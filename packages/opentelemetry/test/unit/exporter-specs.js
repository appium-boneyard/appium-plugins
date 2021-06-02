/* eslint-disable no-unused-vars */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { buildExporter, AVAILABLE_EXPORTERS } from '../../lib/tracing/exporterFactory';
import { ConsoleSpanExporter } from '@opentelemetry/tracing';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { tracerProviderInstance } from '../../lib/tracing/tracerProvider';

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

describe('ExporterFactory', function () {
  after (async function () {
    await tracerProviderInstance.shutdown();
    await tracerProviderInstance.provider.shutdown();
  });
  it(`should return exporter object for ${AVAILABLE_EXPORTERS.CONSOLE} exporter`, async function () {
    const exporterObject = buildExporter('console');
    exporterObject.should.be.instanceOf(ConsoleSpanExporter);
    await exporterObject.shutdown();
  });
  it(`should return exporter object for ${AVAILABLE_EXPORTERS.JAGGER} exporter`, async function () {
    const exporterObject = buildExporter('jagger');
    exporterObject.should.be.instanceOf(JaegerExporter);
    await exporterObject.shutdown();
  });
  it(`should return exporter object for ${AVAILABLE_EXPORTERS.PROMETHEUS} exporter`, async function () {
    const exporterObject = buildExporter('prometheus');
    exporterObject.should.be.instanceOf(PrometheusExporter);
    await exporterObject.shutdown();
  });
  it(`should return exporter object for ${AVAILABLE_EXPORTERS.ZIPKIN} exporter`, async function () {
    const exporterObject = buildExporter('zipkin');
    exporterObject.should.be.instanceOf(ZipkinExporter);
    await exporterObject.shutdown();
  });
  it(`should throw error if exporterType is not in ${Object.keys(AVAILABLE_EXPORTERS)}`, function () {
    try {
      buildExporter('unknown');
    } catch (error) {
      expect(error.message).to.match(/Unsupported exporter type/);
    }
  });
  it('should have all the essential exporters', function () {
    const expectedExporters = ['jagger', 'console', 'prometheus', 'zipkin'];
    for (let key in AVAILABLE_EXPORTERS) {
      expect(expectedExporters).to.contain(AVAILABLE_EXPORTERS[key]);
    }
  });
});