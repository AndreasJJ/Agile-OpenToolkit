import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

import { loadState } from '../helpers/localstorage';

const persistedState = loadState();
const loggerMiddleware = createLogger();

let middleware;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  );
} else {
  middleware = applyMiddleware(
    thunkMiddleware
  );
}

export const store = createStore(
  rootReducer,
  persistedState,
  middleware
);
