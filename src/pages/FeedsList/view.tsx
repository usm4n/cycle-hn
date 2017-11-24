import {
    PageState,
    PageParams
} from '../types';
import { VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { pulse } from '../partials/_pulse';

function prevLink(pageData: PageParams): VNode {
   return +pageData.page! > 1
       ? <a href={`/${pageData.type}/${+pageData.page! - 1}`}>&lt; prev </a>
       : <span className="disabled">&lt; prev </span>;
}

function nextLink(pageData: PageParams): VNode {
   return +pageData.page! < pageData.max
       ? <a href={`/${pageData.type}/${+pageData.page! + 1}`}> next &gt;</a>
       : <span className="disabled"> next &gt;</span>;
}

function currentPosition(pageData: PageParams): VNode {
    return <span className="pager-position">{`${pageData.page} / ${pageData.max}`}</span>;
}

function pager(pageData: PageParams): VNode {
    return (
        <div className="feed-pager">
            {prevLink(pageData)}
            {currentPosition(pageData)}
            {nextLink(pageData)}
        </div>
    );
}

function startOrder(pageData: PageParams): number {
    return ((+pageData.page! - 1) * 30) + 1;
}

function content(state: PageState, feedsDom: VNode): VNode {
    return (
        <div className="feed-content">
            <ol className="feed-list" start={state.meta && startOrder(state.meta)}>{feedsDom}</ol>
            {/* this needs to be looked into */}
            {state.meta && pager(state.meta)}
        </div>
    );
}

export function view(state$: Stream<PageState>, feedsDom$: Stream<VNode>): Stream<VNode> {
    return xs.combine(state$, feedsDom$)
    .map(([state, feedsDom]) => {
        if (!state.isLoading) {
            return content(state, feedsDom);
        } else {
            return pulse();
        }
    });
}
