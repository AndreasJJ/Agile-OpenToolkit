import { userConstants } from '../constants/user';

export function authentication (state = {}, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.REGISTRATION_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.REGISTRATION_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.REGISTRATION_FAILURE:
      return {};
    case userConstants.REFRESH_REQUEST:
      return {
        loggedIn: true,
        refreshing: true,
        user: action.user
      };
    case userConstants.REFRESH_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.REFRESH_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    case userConstants.TEAM_ADD_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.TEAM_ADD_FAILURE:
      return state;
    default:
      return state;
  }
}
