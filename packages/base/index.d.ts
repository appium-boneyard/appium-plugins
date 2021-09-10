import type { Server } from 'http';
import type { Application } from 'express';
import type { BaseDriver } from '@appium/base-driver';

export default class BasePlugin {
    static newMethodMap: {};
    static get argsConstraints(): {};
    constructor(pluginName: string, opts?: {});
    name: string;
    logger: any;
    opts: {};

    static updateServer(expressApp: Application, httpServer: Server): Promise<void>;

    handle(
        next: () => Promise<void>,
        driver: BaseDriver,
        cmdName: string,
        ...args: any[]
    ): Promise<any>;

    shouldAvoidProxy(method: string, route: string, body: any): boolean;
}

export { BaseDriver };
