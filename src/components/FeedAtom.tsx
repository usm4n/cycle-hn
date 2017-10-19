import {
    Sinks,
    Sources,
    Component
} from '../interfaces';
import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';

export interface State {
    id: number;
    title: string;
    points: number;
    user: string;
    time: number;
    time_ago: string;
    comments_count: number;
    content?: string;
    type: string;
    url: string;
    domain: string;
    [data: string]: any;
}

export type Reducer = (prev: State) => State;
export type FeedSinks = Sinks & { onion: Stream<Reducer> };
export type FeedSources = Sources & { onion: StateSource<State> };

function view(state$: Stream<State>): Stream<VNode> {
    return state$.map(feed =>
        <div className="feed">
            <a className="feed-title" href={feed.url}>{feed.title}</a>
            <span className="feed-domain">({feed.domain})</span>
            <div className="feed-footer">
                <span> {feed.points} points </span> by
                <span className="feed-author"> {feed.user}</span>
                <span> {feed.time_ago} | <a href={`/atom/${feed.id}`}>{feed.comments_count} comments </a></span>
            </div>
        </div>
    );
}

export const FeedAtom: Component = function(sources: FeedSources): FeedSinks {
    const vdom$ = view(sources.onion.state$);

    const sinks = {
        DOM: vdom$,
        onion: xs.of<Reducer>((state) => state)
    };

    return sinks;
};
