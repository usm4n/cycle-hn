import isolate from '@cycle/isolate';
import { HTTPSource } from '@cycle/http';
import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import {
    FeedsListState,
    FeedsListSinks as Sinks,
    FeedsListSources as Sources,
    FeedsListReducer as Reducer,
    PageParams
} from './types';
import { State as FeedState } from '../components/FeedAtom';

import { API_URL } from '../app';
import { FeedsCollection } from '../components/FeedCollection';

const defaultState: FeedsListState = {
    pulse: {
        show: true
    },
    meta: {
        max: 0,
        number: 0,
        type: 'news'
    },
    feeds: [] as Array<FeedState>
};

function intent(sources: Sources): Stream<Reducer> {
    const params$ = sources.params$ || xs.of({number: 1, max: 10, type: 'news'});
    const http$ = sources.HTTP.select('feeds').flatten() ;

    const initReducer$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const pageReducer$ = xs.combine(http$, params$)
        .map(([res, params]): any => ({feeds: res.body, params}))
        .map(pageData => function(state: FeedsListState): FeedsListState {
            return {
                ...state,
                meta: pageData.params,
                feeds: pageData.feeds
            };
        } as Reducer);

    return xs.merge(initReducer$, pageReducer$);
}

function pager(pageData: PageParams): VNode {
    return (
        <div className="pager">
            {pageData.number < pageData.max && <a href={`/${pageData.type}/${pageData.number + 1}`}>More</a>}
        </div>
    );
}

function view(state$: Stream<FeedsListState>, feedsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(state$, feedsDom$)
    .map(([state, feedsDom]) =>
        <div className="feed-content">
            <ol className="feed-list">{feedsDom}</ol>
            {pager(state.meta)}
        </div>
    );
}

export default function FeedsList(sources: Sources): Sinks {
    const state$ = sources.onion.state$;

    const request$ = xs.of({
        url: API_URL + '/news',
        category: 'feeds',
        method: 'GET'
    });

    const reducers$: Stream<Reducer> = intent(sources);
    const feedsCollection = isolate(FeedsCollection, 'feeds')(sources);

    const feedsDom$ = feedsCollection.DOM;
    const pageDom$: Stream<VNode> = view(state$, feedsDom$);

    const sinks = {
        DOM: pageDom$,
        HTTP: request$,
        onion: reducers$
    };

    return sinks;
}