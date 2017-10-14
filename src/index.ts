import xs from 'xstream';
import { setup, run } from '@cycle/run';
import { restartable, rerunner } from 'cycle-restart';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { timeDriver } from '@cycle/time';
import isolate from '@cycle/isolate';
import onionify from 'cycle-onionify';

import { Component, Sources, RootSinks } from './interfaces';
import { App } from './app';

const main: Component = onionify(App);

let drivers: any, driverFn: any;
/// #if PRODUCTION
drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    Time: timeDriver
};
/// #else
driverFn = () => ({
    DOM: restartable(makeDOMDriver('#app'), {
        pauseSinksWhileReplaying: false
    }),
    HTTP: restartable(makeHTTPDriver()),
    Time: timeDriver
});
/// #endif
export const driverNames: string[] = Object.keys(drivers || driverFn());

/// #if PRODUCTION
run(main as any, drivers);
/// #else
const rerun = rerunner(setup, driverFn, isolate);
rerun(main as any);

if (module.hot) {
    module.hot.accept('./app', () => {
        const newApp = require('./app').App;

        rerun(onionify(newApp));
    });
}
/// #endif
