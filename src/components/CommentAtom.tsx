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
    level: number;
    user: string;
    time: number;
    time_ago: string;
    content: string;
    comments: Array<Comment>;
}

export type Reducer = (prev: State) => State;
export type CommentSinks = Sinks & { onion: Stream<Reducer> };
export type CommentSources = Sources & { onion: StateSource<State> };

function view(state$: Stream<State>): Stream<VNode> {
    return state$.map(comment =>
        <li className="comment">
            <div className="comment-header">
                <span className="comment-author"> {comment.user} </span>
                <span> {comment.time_ago} </span>
            </div>
            <div className="comment-content">
                {comment.content}
            </div>
        </li>
    );
}

export const CommentAtom: Component = function(sources: CommentSources): CommentSinks {
    const vdom$ = view(sources.onion.state$);

    const sinks = {
        DOM: vdom$,
        onion: xs.of<Reducer>((state) => state)
    };

    return sinks;
};
