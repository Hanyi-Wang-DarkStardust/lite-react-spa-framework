import {
  createBrowserHistory, createHashHistory, createMemoryHistory,
  History,
} from 'history';

export const browserHistory: History = createBrowserHistory({ window });

export const hashHistory: History = createHashHistory({ window });

export const memoryHistory: History = createMemoryHistory();
