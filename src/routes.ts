import { Component } from './interfaces';
import { PageParams } from './pages/types';
import { createListPage } from './pages/factory';
import FeedsList from './pages/FeedsList';

export interface RouteDefinition {
    [path: string]: RouteDefinition | any;
}

export interface MatchedRoute {
    path: string | null;
    value: Component | any;
}

export const Routes: RouteDefinition = {
    '/': createListPage({max: 10, type: 'news', number: 1}),
    '/news': {
        '/': createListPage({max: 10, type: 'news', number: 1}),
        '/:number': (number: number) => createListPage({max: 10, type: 'news', number})
    },
    '/top': {
        '/': createListPage({max: 12, type: 'newest', number: 1}),
        '/:number': (number: number) => createListPage({max: 12, type: 'newest', number})
    },
    '/show': {
        '/': createListPage({max: 2, type: 'show', number: 1}),
        '/:number': (number: number) => createListPage({max: 2, type: 'show', number})
    },
    '/ask': {
        '/': createListPage({max: 3, type: 'ask', number: 1}),
        '/:number': (number: number) => createListPage({max: 3, type: 'ask', number})
    },
    '/jobs': {
        '/': createListPage({max: 1, type: 'show', number: 1}),
        '/:number': (number: number) => createListPage({max: 1, type: 'jobs', number})
    }
};
