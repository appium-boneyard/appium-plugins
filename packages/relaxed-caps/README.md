# THIS PROJECT IS ARCHIVED. ALL PACKAGES IN THIS REPO HAVE MOVED INTO [THE MAIN APPIUM REPO at https://github.com/appium/appium](https://github.com/appium/appium)

> Note:
> - Package names have not changed, but the directory names all have the `-plugin` suffix. They still live in the `packages/` subdir.
> - As of this writing (April 14 2022), the packages are not in the `master` branch--they are in the `2.0` branch--but will be in the default branch (`main`) in the near future.

* * *
# Appium Relaxed Caps Plugin

With the advent of Appium 2.0, the Appium server begins to require that all capabilities conform to the W3C [requirements for capabilities](https://www.w3.org/TR/webdriver/#capabilities). Among these requirements is one that restricts capabilities to those found in a predetermined set. Appium supports many additional capabilities as extension capabilities, and these must be accessed with the prefix `appium:` in front of the capability name.

There are a lot of test scripts out there that don't conform to the requirement, and so this plugin is designed to make it easy to keep running these scripts even with the new stricter capabilities requirements beginning with Appium 2.0. Basically, it inserts the `appium:` prefix for you!

## Installation - Server

Install the plugin using Appium's plugin CLI, either as a named plugin or via NPM:

```
appium plugin install relaxed-caps
appium plugin install --source=npm @appium/relaxed-caps-plugin
```

## Installation - Client

No special action is needed to make things work on the client side. Just keep sending in your unprefixed caps!

## Activation

The plugin will not be active unless turned on when invoking the Appium server:

```
appium --use-plugins=relaxed-caps
```
