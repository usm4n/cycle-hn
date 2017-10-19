import { view } from './view';
import { intent } from './intent';
import { VNode } from '@cycle/dom';
import { API_URL } from '../../app';
import isolate from '@cycle/isolate';
import xs, { Stream } from 'xstream';
import {
    PageSinks as Sinks,
    PageSources as Sources,
    PageReducer as Reducer
} from '../types';
import { FeedAtom } from '../../components/FeedAtom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { CommentCollection } from '../../components/CommentCollection';

function requestMapper({id, type}: {id: string, type: string}): RequestOptions {
    return {
        method: 'GET',
        category: 'atom',
        url: API_URL + `/${type}/${id}.json`
    };
}

export default function FeedsView(sources: Sources): Sinks {
    const state$ = sources.onion.state$;

    const request$ = sources.params$.map(requestMapper)
        .debug('Request==');

    const reducers$: Stream<Reducer> = intent(sources);
    const feedAtom = isolate(FeedAtom, 'feed')(sources);
    const commentCollection = isolate(CommentCollection, 'comments')(sources);

    const pageDom$: Stream<VNode> = view(feedAtom.DOM, commentCollection.DOM);

    const sinks = {
        DOM: pageDom$,
        HTTP: request$,
        onion: reducers$
    };

    return sinks;
}
