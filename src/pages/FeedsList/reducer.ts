import isolate from '@cycle/isolate';
import xs, { Stream } from 'xstream';
import {
    PageState,
    PageSources as Sources,
    PageReducer as Reducer
} from '../types';
import { State as FeedState } from '../../components/FeedAtom';

const defaultState: PageState = {
    pulse: {
        show: true
    },
    meta: {
        max: 0,
        page: '0',
        type: 'news'
    },
    feeds: [] as Array<FeedState>
};

export function makeReducer$(sources: Sources): Stream<Reducer> {
    const params$ = sources.params$;
    const http$ = sources.HTTP.select('feeds').flatten() ;

    const initReducer$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const pageReducer$ = xs.combine(http$, params$)
        .map(([res, params]): any => ({feeds: res.body, params}))
        .map(pageData => function(state: PageState): PageState {
            return {
                ...state,
                meta: pageData.params,
                feeds: pageData.feeds
            };
        } as Reducer);

    return xs.merge(initReducer$, pageReducer$);
}
