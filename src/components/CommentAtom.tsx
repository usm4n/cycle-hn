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

function view(state$: Stream<State>, action$: Stream<any>): Stream<VNode> {
    return xs.combine(state$, action$)
        .map(([comment, showComment]) =>
        <li className="comment">
            <div className={'comment-header ' + `${!showComment ? 'active' : ''}`}>
                <span className="comment-author"> {comment.user} </span>
                <span> {comment.time_ago} </span>
                <span className="comment-hide">[{showComment ? '-' : '+'}]</span>
            </div>
            {showComment && <div className="comment-content" innerHTML={comment.content}/>}
        </li>
    );
}

export const CommentAtom: Component = function(sources: CommentSources): CommentSinks {
    const action$ = intent(sources);
    const vdom$ = view(sources.onion.state$, action$);

    const sinks = {
        DOM: vdom$,
        onion: xs.of<Reducer>((state) => state)
    };

    return sinks;
};
