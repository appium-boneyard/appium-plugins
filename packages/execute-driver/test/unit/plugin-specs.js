import { ExecuteDriverPlugin } from '../../index';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const should = chai.should();

describe('execute driver plugin', function () {
  it('should exist', function () {
    should.exist(ExecuteDriverPlugin);
  });
});
