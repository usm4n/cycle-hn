import xs, { Stream } from 'xstream';
import { StateSource, makeCollection } from 'cycle-onionify';
import { Component, Sources, Sinks } from '../interfaces';
import { FeedAtom, State as FeedState } from './FeedAtom';

export const FeedsCollection: Component = makeCollection<FeedState, Sources, Sinks>({
    item: FeedAtom,
    itemKey: state => String(state.id),
    itemScope: key => key,
    collectSinks: instances => ({
        DOM: instances.pickCombine('DOM').map(itemNodes =>
            itemNodes.map(item => ({...item, sel: 'li'})
        ))
    })
});
