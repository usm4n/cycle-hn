import xs from 'xstream';
import FeedVeiw from './FeedView';
import FeedView from './FeedView';
import FeedsList from './FeedsList';
import { Component } from '../interfaces';
import { PageSinks, PageSources, PageParams } from './types';

export function createPage(page: string, params: PageParams): Component {
    const params$ = xs.of(params);

    return (sources: PageSources): PageSinks => {
        const pageSources: PageSources = {params$, ...sources};

        if (page === 'atom') {
            return FeedView(pageSources);
        } else {
            return FeedsList(pageSources);
        }
    };
}
