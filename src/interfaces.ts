import { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { TimeSource } from '@cycle/time';

export type Sources = {
    DOM: DOMSource;
    HTTP: HTTPSource;
    Time: TimeSource;
};

export type RootSinks = {
    DOM: Stream<VNode>;
    HTTP: Stream<RequestOptions>;
};

export type Sinks = Partial<RootSinks>;
export type Component = (s: Sources) => Sinks;
