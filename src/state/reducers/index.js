import { combineReducers } from 'redux';

import { authentication } from './authentication';
import { alert } from './alert';
import { product } from './product';

const rootReducer = combineReducers({
  authentication,
  alert,
  product
});

export default rootReducer;
