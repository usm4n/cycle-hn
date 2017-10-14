import { forall, assert, nat, Options } from 'jsverify';
import { diagramArbitrary, withTime } from 'cyclejs-test-helpers';
const htmlLooksLike = require('html-looks-like');
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

import xs, { Stream } from 'xstream';
import { mockDOMSource, VNode } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import onionify from 'cycle-onionify';

import { App } from '../src/app';

const testOptions: Options = {
    tests: 10,
    size: 200
};

describe('app tests', () => {
    const expectedHTML = (count: number) => `
        <div>
            <h2>My Awesome Cycle.js app</h2>
            <span>Counter: ${count}</span>
            <button>Increase</button>
            <button>Decrease</button>
        </div>
    `;

    it('should interact correctly', () => {
        const property = forall(
            diagramArbitrary,
            diagramArbitrary,
            (addDiagram, subtractDiagram) =>
                withTime(Time => {
                    const add$ = Time.diagram(addDiagram);
                    const subtract$ = Time.diagram(subtractDiagram);

                    const DOM = mockDOMSource({
                        '.add': { click: add$ },
                        '.subtract': { click: subtract$ }
                    });

                    const app = onionify(App)({ DOM } as any);
                    const html$ = (app.DOM as Stream<VNode>).map(toHtml);

                    const expected$ = xs
                        .merge(add$.mapTo(+1), subtract$.mapTo(-1))
                        .fold((acc, curr) => acc + curr, 0)
                        .map(expectedHTML);

                    Time.assertEqual(html$, expected$, htmlLooksLike);
                })
        );

        return assert(property, testOptions);
    });
});
