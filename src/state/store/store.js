import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

import { loadState } from '../helpers/localstorage';

const persistedState = loadState();
const loggerMiddleware = createLogger();

export const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);
