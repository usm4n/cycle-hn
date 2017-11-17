import { Component } from './interfaces';
import { PageParams } from './pages/types';
import { createPage } from './pages/factory';

export interface RouteDefinition {
    [path: string]: RouteDefinition | any;
}

export interface MatchedRoute {
    path: string | null;
    value: Component | any;
}

export const Routes: RouteDefinition = {
    '/': createPage('list', {max: 10, type: 'news', page: '1'}),
    '/news': createPage('list', {max: 10, type: 'news', page: '1'}),
    '/news/:page': (page: string) => createPage('list', {max: 10, type: 'news', page}),
    '/newest': createPage('list', {max: 12, type: 'newest', page: '1'}),
    '/newest/:page': (page: string) => createPage('list', {max: 12, type: 'newest', page}),
    '/show': createPage('list', {max: 2, type: 'show', page: '1'}),
    '/show/:page': (page: string) => createPage('list', {max: 2, type: 'show', page}),
    '/ask': createPage('list', {max: 2, type: 'ask', page: '1'}),
    '/ask/:page': (page: string) => createPage('list', {max: 2, type: 'ask', page}),
    '/jobs': createPage('list', {max: 1, type: 'show', page: '1'}),
    '/jobs/:page': (page: string) => createPage('list', {max: 1, type: 'jobs', page}),
    '/atom/:id': (id: string) => createPage('atom', {id, type: 'item'}),
    '*': createPage('list', {max: 10, type: 'news', page: '1'})
};
