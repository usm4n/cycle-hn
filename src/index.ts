import xs from 'xstream';
import isolate from '@cycle/isolate';
import onionify from 'cycle-onionify';
import { setup, run } from '@cycle/run';
import { timeDriver } from '@cycle/time';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { restartable, rerunner } from 'cycle-restart';
import { makeHistoryDriver, captureClicks } from '@cycle/history';

import { App } from './app';
import { Component, Sources, RootSinks } from './interfaces';

const main: Component = onionify(App);

let drivers: any, driverFn: any;
/// #if PRODUCTION
drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    Time: timeDriver,
    History: captureClicks(makeHistoryDriver())
};
/// #else
driverFn = () => ({
    DOM: restartable(makeDOMDriver('#app'), {
        pauseSinksWhileReplaying: false
    }),
    HTTP: restartable(makeHTTPDriver()),
    Time: timeDriver,
    History: captureClicks(makeHistoryDriver())
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
