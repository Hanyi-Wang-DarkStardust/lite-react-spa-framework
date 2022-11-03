import type { History } from 'history';
import React, { useLayoutEffect, useState } from 'react';
import { Location, NavigationType, Router } from 'react-router-dom';

interface IHistoryRouter {
  basename?: string;
  children?: React.ReactNode,
  history: History
}

interface IHistoryRouterStates {
  action: NavigationType,
  location: Location,
}

/**
 * 支持自定义 history 的 react-router-dom Router 组件
 * 当前支持 browserHistory, hashHistory, memoryHistory
 */
export const HistoryRouter: React.FC<IHistoryRouter> = (props: IHistoryRouter) => {
  const { basename, children, history } = props;
  const {
    action: propsHistoryAction,
    location: propsHistoryLocation,
    listen: listenerFunction,
  } = history;
  const [state, setState] = useState<IHistoryRouterStates>({
    action: propsHistoryAction,
    location: propsHistoryLocation,
  });

  useLayoutEffect(() => listenerFunction(setState), [history, listenerFunction]);
  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}>
      {children}
    </Router>);
};
