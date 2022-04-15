# THIS PROJECT IS ARCHIVED. ALL PACKAGES IN THIS REPO HAVE MOVED INTO [THE MAIN APPIUM REPO at https://github.com/appium/appium](https://github.com/appium/appium)

> Note:
> - Package names have not changed, but the directory names all have the `-plugin` suffix. They still live in the `packages/` subdir.
> - As of this writing (April 14 2022), the packages are not in the `master` branch--they are in the `2.0` branch--but will be in the default branch (`main`) in the near future.

* * *
# Appium Universal XML Plugin

This is an official Appium plugin designed to make XML source retrieved from iOS and Android use the same node and attribute names, to facilitate cross-platform test writing.

## Features

TODO

## Installation - Server

TODO

## Installation - Client

No special action is needed to make the features available in the various Appium clients, as this plugin simply alters the behavior of the existing "get page source" and "find element" methods.

## Activation

The plugin will not be active unless turned on when invoking the Appium server:

```
appium --use-plugins=universal-xml
```

## Usage

TODO
