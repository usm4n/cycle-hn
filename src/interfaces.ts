import { Stream } from 'xstream';
import { TimeSource } from '@cycle/time';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { Location } from 'history';
import { HistoryInput, HistoryDriver } from '@cycle/history';

export type Sources = {
    DOM: DOMSource;
    HTTP: HTTPSource;
    Time: TimeSource;
    History: Stream<Location>,
};

export type RootSinks = {
    DOM: Stream<VNode>;
    HTTP: Stream<RequestOptions>;
    History: Stream<HistoryInput>
};

export type Sinks = Partial<RootSinks>;
export type Component = (s: Sources) => Sinks;
