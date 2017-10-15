import { Location } from 'history';
import switchPath from 'switch-path';
import xs, { Stream } from 'xstream';
import isolate from '@cycle/isolate';
import FeedsList from './pages/FeedsList';
import { StateSource } from 'cycle-onionify';
import { Sources, Sinks } from './interfaces';
import { VNode, DOMSource } from '@cycle/dom';
import { PageState } from './pages/types';
import { Routes, MatchedRoute } from './routes';

export const API_URL = 'https://node-hnapi.herokuapp.com';

export type AppState = {
    page: PageState;
};

const defaultAppState: AppState = {
    page: {} as PageState
};

export type Reducer = (prev?: AppState) => AppState | undefined;
export type AppSinks = Sinks & { onion: Stream<Reducer> };
export type AppSources = Sources & { onion: StateSource<AppState>};

function initState(): Stream<Reducer> {
    const initReducer$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultAppState : prevState)
    );

    return initReducer$;
}

function navigation(currentPath: string): VNode {
    return (
        <span>
            <a href="#"> new </a>|
            <a href="#"> comments </a>|
            <a href="#"> show </a>|
            <a href="#"> ask </a>|
            <a href="#"> jobs </a>
        </span>
    );
}

function view(vdom$: Stream<VNode>): Stream<VNode> {
    return vdom$.map(vdom =>
        <div className="main-wrapper">
            <div className="header-wrapper">
                <img className="logo" src="./public/cycle.png" alt="logo"/>
                <a className="home">Cycle HN</a>
                {navigation()}
            </div>
            <div className="main-content">
                {vdom}
            </div>
        </div>
    );
}

export function App(sources: AppSources): AppSinks {
    const history$: Stream<Location> = sources.History;

    sources.onion.state$.addListener({
        next: value => console.log(value)
    });

    const initState$ = initState();

    const pageSinks$ = history$.map((location: Location): MatchedRoute => {
        const {pathname} = location;
        console.log(location);

        return switchPath(pathname, Routes);
    }).debug('component==>').map((route: MatchedRoute) => isolate(route.value, 'page')(sources));

    // const feedsSinks: AppSinks = isolate(FeedsList, 'page')(sources);

    // const pageSinks = extractSinks(pageSinks$, drivers)
    const pageDom$ = pageSinks$.map(sinks => sinks.DOM).flatten();
    const pageRequests$ = pageSinks$.map(sinks => sinks.HTTP).flatten();
    const pageReducers$ = pageSinks$.map(sinks => sinks.onion).flatten();

    const reducers$ = xs.merge<Reducer>(pageReducers$, initState$);

    reducers$.addListener({
        next: (value: Reducer) => console.log(value)
    });
    const vdom$ = view(pageDom$ as Stream<VNode>);

    return {
        DOM: vdom$,
        HTTP: pageRequests$,
        onion: reducers$
    };
}
