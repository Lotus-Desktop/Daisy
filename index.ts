export * as app from './app/index';
export * as gui from './gui/index';
export * as event from './event/index';
export * as graphics from './graphics/index';
export * as dld from './dld/index';

import Application from "./app";

export default {
    Application,
    setEntryPoint<T extends Application>(app: new() => T) {
        new app();
    }
}
