import xs, { Stream } from 'xstream';
import { StateSource, makeCollection } from 'cycle-onionify';
import { Component, Sources, Sinks } from '../interfaces';
import { CommentAtom, State as CommentState } from './CommentAtom';

export const CommentCollection: Component = makeCollection<CommentState, Sources, Sinks>({
    item: CommentAtom,
    itemKey: state => String(state.id),
    itemScope: key => key,
    collectSinks: instances => ({
        DOM: instances.pickCombine('DOM')
    })
});
