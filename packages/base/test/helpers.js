/* eslint-disable no-console */
import { exec } from 'teen_process';
import { main as appiumServer } from 'appium';
import getPort from 'get-port';

function e2eSetup (opts = {}) {
  let {
    before,
    after,
    server,
    serverArgs = {},
    driverSource,
    driverPackage,
    driverName,
    driverSpec,
    pluginSource,
    pluginPackage,
    pluginSpec,
    pluginName,
    port,
    host,
  } = opts;

  before(async function () {
    console.log('Checking whether driver dep is installed');
    let listArgs = ['appium', 'driver', 'list', '--json'];
    let {stdout} = await exec('npx', listArgs);
    let installed = JSON.parse(stdout);

    if (!installed[driverName]?.installed) {
      console.log('Not installed, installing...');
      const driverArgs = ['appium', 'driver', 'install', '--source', driverSource, driverSpec];
      if (driverPackage) {
        driverArgs.push('--package', driverPackage);
      }
      await exec('npx', driverArgs);
    }
    console.log('Driver dep is installed');

    console.log('Checking whether plugin is installed');
    listArgs = ['appium', 'plugin', 'list', '--json'];
    ({stdout} = await exec('npx', listArgs));
    installed = JSON.parse(stdout);

    if (!installed[pluginName]?.installed) {
      console.log('Installing the local version of this plugin');
      const pluginArgs = ['appium', 'plugin', 'install', '--source', pluginSource, pluginSpec];
      if (pluginPackage) {
        pluginArgs.push('--package', pluginPackage);
      }
      await exec('npx', pluginArgs);
    }
    console.log('This plugin is installed');

    if (!port) {
      port = await getPort();
    }
    console.log(`Will use port ${port} for Appium server`);
    this.port = port;

    const args = {port, host, usePlugins: [pluginName], useDrivers: [driverName], ...serverArgs};
    server = await appiumServer(args);
  });

  after(function () {
    if (server) {
      server.close();
    }
  });

  return port;
}

export { e2eSetup };
