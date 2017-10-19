import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import {
    PageState,
    PageParams
} from '../types';

function pager(pageData: PageParams): VNode {
    return (
        <div className="feed-pager">
            {+pageData.page! < pageData.max && <a href={`/${pageData.type}/${+pageData.page! + 1}`}>More</a>}
        </div>
    );
}

function content(state: PageState, feedsDom: VNode): VNode {
    return (
        <div className="feed-content">
             <ol className="feed-list">{feedsDom}</ol>
               {pager(state.meta!)}
        </div>
    );
}

export function view(state$: Stream<PageState>, feedsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(state$, feedsDom$)
    .map(([state, feedsDom]) => {
        if (!state.isLoading) {
            return content(state, feedsDom);
        } else {
            return <div>Loading...</div>;
        }
    });
}
