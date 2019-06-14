import { combineReducers } from 'redux';

import { authentication } from './authentication';
import { teams } from './teams'
import { alert } from './alert';


const rootReducer = combineReducers({
  authentication,
  teams,
  alert
});

export default rootReducer;