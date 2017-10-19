import {
    Sinks,
    Sources,
    Component
} from '../interfaces';
import { VNode } from '@cycle/dom';
import isolate from '@cycle/isolate';
import xs, { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';
import { CommentCollection } from './CommentCollection';

export interface State {
    id: number;
    level: number;
    user: string;
    time: number;
    time_ago: string;
    content: string;
    comments: Array<State>;
}

export type Reducer = (prev: State) => State;
export type CommentSinks = Sinks & { onion: Stream<Reducer> };
export type CommentSources = Sources & { onion: StateSource<State> };

function intent(sources: Sources): Stream<boolean> {
    return sources.DOM.select('.comment-hide')
        .events('click')
        .mapTo(undefined)
        .fold((show: boolean) => !show, true);
}

function view(state$: Stream<State>, commentChildren$: Stream<VNode>, action$: Stream<any>): Stream<VNode> {
    return xs.combine(state$, commentChildren$, action$)
        .map(([comment, children, showComment]) =>
        <li className="comment">
            <div className={'comment-header ' + `${!showComment ? 'active' : ''}`}>
                <span className="comment-author"> {comment.user} </span>
                <span> {comment.time_ago} </span>
                <span className="comment-hide">[{showComment ? '-' : '+'}]</span>
            </div>
            {showComment && <div className="comment-content" innerHTML={comment.content}>
                <a className="reply" href={`https://news.ycombinator.com/reply?id=${comment.id}`}>reply</a>
            </div>}
            {(children && showComment) && <ul className="comment-list">
                {children}
            </ul>}
        </li>
    );
}

export const CommentAtom: Component = function(sources: CommentSources): CommentSinks {
    const action$ = intent(sources);
    const commentChildren = isolate(CommentCollection, 'comments')(sources);

    const vdom$ = view(sources.onion.state$, commentChildren.DOM, action$);

    const sinks = {
        DOM: vdom$,
        onion: xs.of<Reducer>((state) => state)
    };

    return sinks;
};
