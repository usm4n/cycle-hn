import isolate from '@cycle/isolate';
import xs, { Stream } from 'xstream';
import {
    PageState,
    PageSources as Sources,
    PageReducer as Reducer
} from '../types';
import { State as FeedState } from '../../components/FeedAtom';
import { State as CommentState } from '../../components/CommentAtom';

const defaultState: PageState = {
    isLoading: true,
    feed: {} as FeedState,
    comments: {} as Array<CommentState>
};

function extractFeed(data: any): FeedState {
    const keys: Array<string> = Object.keys(data);

    return keys.reduce((feed: FeedState, key: string) => {
        if (key !== 'comments') {
            feed[key] = data[key];
        }

        return feed;
    }, {} as FeedState);
}

export function makeReducer$(sources: Sources): Stream<Reducer> {
    const http$ = sources.HTTP.select('atom').flatten() ;

    const initReducer$ = xs.of<Reducer>(() => defaultState);

    const pageReducer$ = http$.map((res: any) => res.body)
        .map(pageData => function(state: PageState): PageState {
            return {
                ...state,
                feed: extractFeed(pageData),
                comments: pageData.comments
            };
        } as Reducer);

    return xs.merge(initReducer$, pageReducer$);
}
