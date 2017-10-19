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

function url(feed: State): VNode {
    if (feed.url && feed.url.startsWith('http')) {
        return <a className="feed-title" href={feed.url}>{feed.title}</a>;
    } else {
        return <a className="feed-title" href={`/atom/${feed.id}`}>{feed.title}</a>;
    }
}

function domain(feed: State): any {
    return feed.domain && <span className="feed-domain">({feed.domain})</span>;
}

function author(feed: State): any {
    return feed.type !== 'job' && <span className="feed-author"> by {feed.user}</span>;
}
function points(feed: State): any {
    return feed.type !== 'job' && <span> {feed.points} points </span>;
}
function commentsLink(feed: State): any {
    return feed.type !== 'job' && <a href={`/atom/${feed.id}`}> | {feed.comments_count} comments </a>;
}

function view(state$: Stream<State>): Stream<VNode> {
    return state$.map(feed =>
        <div className="feed">
            {url(feed)}
            {domain(feed)}
            <div className="feed-footer">
                {points(feed)}
                {author(feed)}
                <span> {feed.time_ago} {commentsLink(feed)}</span>
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
