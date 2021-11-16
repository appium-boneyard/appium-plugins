import path from 'path';
const APPIUM_HOME = path.resolve(__dirname, '..', '..', '..', 'local_appium_home');
// need to assign this before appium is imported via e2eSetup
process.env.APPIUM_HOME = APPIUM_HOME;

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { remote as wdio } from 'webdriverio';
import { MATCH_FEATURES_MODE, GET_SIMILARITY_MODE } from '../../lib/compare';
import { TEST_IMG_1_B64, TEST_IMG_2_B64, APPSTORE_IMG_PATH } from '../fixtures';
import { e2eSetup } from '@appium/base-plugin/build/test/helpers';

chai.use(chaiAsPromised);
chai.should();

const THIS_PLUGIN_DIR = path.resolve(__dirname, '..', '..', '..');
const TEST_HOST = 'localhost';
const TEST_FAKE_APP = path.resolve(APPIUM_HOME, '@appium', 'fake-driver', 'node_modules',
  '@appium', 'fake-driver', 'test', 'fixtures', 'app.xml');
const TEST_CAPS = {
  platformName: 'Fake',
  'appium:automationName': 'Fake',
  'appium:deviceName': 'Fake',
  'appium:app': TEST_FAKE_APP
};
const WDIO_OPTS = {
  hostname: TEST_HOST,
  connectionRetryCount: 0,
  capabilities: TEST_CAPS
};

describe('ImageElementPlugin', function () {
  let server, driver = null;

  after(async function () {
    if (driver) {
      await driver.deleteSession();
    }
  });

  e2eSetup({
    before, after, server, host: TEST_HOST, driverName: 'fake', driverSource: 'npm',
    driverSpec: '@appium/fake-driver', pluginName: 'images', pluginSource: 'local',
    pluginSpec: THIS_PLUGIN_DIR,
  });

  it('should add the compareImages route', async function () {
    driver = await wdio({...WDIO_OPTS, port: this.port});
    let comparison = await driver.compareImages(MATCH_FEATURES_MODE, TEST_IMG_1_B64, TEST_IMG_2_B64, {});
    comparison.count.should.eql(0);
    comparison = await driver.compareImages(GET_SIMILARITY_MODE, TEST_IMG_1_B64, TEST_IMG_2_B64, {});
    comparison.score.should.be.above(0.2);
  });

  it('should find and interact with image elements', async function () {
    const imageEl = await driver.$(APPSTORE_IMG_PATH);
    const {x, y} = await imageEl.getLocation();
    const {width, height} = await imageEl.getSize();
    x.should.eql(28);
    y.should.eql(72);
    width.should.eql(80);
    height.should.eql(91);
    await imageEl.click();
  });
});
