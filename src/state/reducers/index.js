import { combineReducers } from 'redux';

import { authentication } from './authentication';
import { users } from './users';
import { alert } from './alert';

const rootReducer = combineReducers({
  authentication,
  users,
  alert
});

export default rootReducer;