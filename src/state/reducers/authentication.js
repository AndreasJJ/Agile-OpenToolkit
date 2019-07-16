import { userConstants } from '../constants/user';

export function authentication (state = {}, action) {
  switch (action.type) {
    case userConstants.SET_USER_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.SET_USER_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.SET_USER_FAILURE:
      return {};
    default:
      return state;
  }
}
