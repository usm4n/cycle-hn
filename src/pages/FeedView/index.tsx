import xs, { Stream } from 'xstream';
import isolate from '@cycle/isolate';
import { StateSource, makeCollection } from 'cycle-onionify';
import { State as FeedState } from '../../components/FeedAtom';
import { Sources, Sinks } from '../../interfaces';

import { API_URL } from '../../app';

export interface State {
}

export default function FeedsView(sources: Sources): Sinks {
    const request$ = xs.of({
        url: API_URL + '/news',
        category: 'feeds',
        method: 'GET'
    });

    const response$ = sources.HTTP.select('feeds')
        .flatten()
        .map(res => res.body).debug('body');

    const vdom$ = response$.map(feeds => <p>Response received</p>);

    const sinks = {
        DOM: vdom$,
        HTTP: request$
    };

    return sinks;
}
