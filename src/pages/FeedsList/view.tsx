import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import {
    FeedsListState,
    PageParams
} from '../types';

function pager(pageData: PageParams): VNode {
    return (
        <div className="pager">
            {+pageData.page < pageData.max && <a href={`/${pageData.type}/${+pageData.page + 1}`}>More</a>}
        </div>
    );
}

export function view(state$: Stream<FeedsListState>, feedsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(state$, feedsDom$)
    .map(([state, feedsDom]) =>
        <div className="feed-content">
            <ol className="feed-list">{feedsDom}</ol>
            {pager(state.meta)}
        </div>
    );
}
