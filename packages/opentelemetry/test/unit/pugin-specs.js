import OpentelemetryPlugin from '../../index';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const should = chai.should();

describe('Opentelemetry plugin', function () {
  it('should exist', function () {
    should.exist(OpentelemetryPlugin);
  });
  it('should define its name', function () {
    const p = new OpentelemetryPlugin('foo');
    p.name.should.eql('foo');
  });
  it('should create a logger', function () {
    const p = new OpentelemetryPlugin('foo');
    should.exist(p.logger);
  });
  it('should define no server update method', function () {
    should.exist(OpentelemetryPlugin.updateServer);
  });
  it('should define a default list of no new methods', function () {
    OpentelemetryPlugin.newMethodMap.should.eql({});
  });
});
