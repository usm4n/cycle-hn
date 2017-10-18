import { PageParams, PulseLoader } from './types';
import { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';
import { Sources, Sinks } from '../interfaces';
import { State as FeedState } from '../components/FeedAtom';

export interface PageParams {
    max: number;
    type: string;
    page: string;
}

export interface PulseLoader {
    show: boolean;
}

interface PageBase {
    meta: PageParams;
    pulse: PulseLoader;
}

export interface FeedViewState extends PageBase {
    atom: FeedState & {

    };
}

export interface FeedsListState extends PageBase {
    feeds: Array<FeedState>;
}

export type PageState = FeedsListState | FeedViewState;

export type PageSinks = Sinks & { onion: Stream<PageReducer> };
export type PageReducer = (prev?: PageState) => PageState | undefined;
export type PageSources = Sources & { onion: StateSource<PageState>, params$: Stream<PageParams>};
