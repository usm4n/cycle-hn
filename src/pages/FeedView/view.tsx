import {
    PageState,
    FeedViewState as AtomState
} from '../types';
import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { pulse } from '../partials/_pulse';

function content(feedDom: VNode, commentsDom: VNode): VNode {
    return (<div className="feed-view">
        {feedDom}
        <div className="comment-content">
            <ul className="comment-list">
                {commentsDom}
            </ul>
        </div>
    </div>);
}
export function view(state$: Stream<PageState>, feedDom$: Stream<VNode>, commentsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(state$, feedDom$, commentsDom$)
        .map(([state, feed, comments]) => {
            if (!state.isLoading) {
                return content(feed, comments);
            } else {
                return pulse();
            }
        });
}
