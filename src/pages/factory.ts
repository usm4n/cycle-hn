import xs from 'xstream';
import FeedVeiw from './FeedView';
import FeedsList from './FeedsList';
import { Component, Sinks } from '../interfaces';
import { FeedsListSinks, FeedsListSources, PageParams } from './types';

export function createListPage(params: PageParams): Component {
    const params$ = xs.of(params);

    return (sources: FeedsListSources): FeedsListSinks => {
        const pageSources: FeedsListSources = {params$, ...sources};

        return FeedsList(pageSources);
    };
}
