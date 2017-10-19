import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import {
    PageState,
    FeedViewState as AtomState
} from '../types';

export function view(feedDom$: Stream<VNode>, commentsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(feedDom$, commentsDom$)
        .map(([feed, comments]) =>
            <div className="feed-view">
                {feed}
                <div className="comment-content">
                    <ul className="comment-list">
                        {comments}
                    </ul>
                </div>
            </div>
        );
}
