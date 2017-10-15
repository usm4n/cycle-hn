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
    '/': createListPage({max: 10, type: 'news', page: '1'}),
    '/news': createListPage({max: 10, type: 'news', page: '1'}),
    '/news/:page': (page: string) => createListPage({max: 10, type: 'news', page}),
    '/newest': createListPage({max: 12, type: 'newest', page: '1'}),
    '/newest/:page': (page: string) => createListPage({max: 12, type: 'newest', page}),
    '/show': createListPage({max: 2, type: 'show', page: '1'}),
    '/show/:page': (page: string) => createListPage({max: 2, type: 'show', page}),
    '/ask': createListPage({max: 3, type: 'ask', page: '1'}),
    '/ask/:page': (page: string) => createListPage({max: 3, type: 'ask', page}),
    '/jobs': createListPage({max: 1, type: 'show', page: '1'}),
    '/jobs/:page': (page: string) => createListPage({max: 1, type: 'jobs', page})
};
