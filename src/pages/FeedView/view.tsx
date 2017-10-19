import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import {
    PageState,
    PageParams
} from '../types';

export function view(state$: Stream<PageState>, feedsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(state$, feedsDom$)
    .map(([state, feedsDom]) =>
        <div className="feed-content">
            <ol className="feed-list">{feedsDom}</ol>
        </div>
    );
}
