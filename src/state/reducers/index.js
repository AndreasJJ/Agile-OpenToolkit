import { combineReducers } from 'redux';

import { authentication } from './authentication';
import { alert } from './alert';


const rootReducer = combineReducers({
  authentication,
  alert
});

export default rootReducer;