import xs from 'xstream';
import FeedVeiw from './FeedView';
import FeedsList from './FeedsList';
import { Component } from '../interfaces';
import { PageSinks, PageSources, PageParams } from './types';

export function createListPage(params: PageParams): Component {
    const params$ = xs.of(params);

    return (sources: PageSources): PageSinks => {
        const pageSources: PageSources = {params$, ...sources};

        return FeedsList(pageSources);
    };
}
