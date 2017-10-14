import { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';
import { Sources, Sinks } from '../interfaces';
import { State as FeedState } from '../components/FeedAtom';

export interface PageParams {
    max: number;
    type: string;
    number: number;
}

export interface PulseLoader {
    show: boolean;
}

export interface FeedViewState {
    pulse: PulseLoader;
}

export interface FeedsListState {
    meta: PageParams;
    pulse: PulseLoader;
    feeds: Array<FeedState>;
}

export type PageState = FeedsListState | FeedViewState;

export type FeedsListSinks = Sinks & { onion: Stream<FeedsListReducer> };
export type FeedsListReducer = (prev?: FeedsListState) => FeedsListState | undefined;
export type FeedsListSources = Sources & { onion: StateSource<FeedsListState>, params$: Stream<PageParams>};
