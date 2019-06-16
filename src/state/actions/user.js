import { userConstants } from '../constants/user';
import { userService } from '../services/user';
import { alertActions } from './alert';
import { history } from '../helpers/history';

export const userActions = {
  login,
  logout,
  register,
  refresh,
  addTeams
};

function login (username, password) {
  return dispatch => {
    dispatch(request({ username, password }));

    userService.login(username, password)
      .then(
        user => {
          dispatch(success(user));
          history.push('/dashboard');
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request (user) { return { type: userConstants.LOGIN_REQUEST, user }; }
  function success (user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
  function failure (error) { return { type: userConstants.LOGIN_FAILURE, error }; }
}

function logout (user) {
  userService.logout(user);
  history.push('/login');
  return { type: userConstants.LOGOUT };
}

function register (email, password, firstname, lastname) {
  return dispatch => {
    dispatch(request({ email, password, firstname, lastname }));

    userService.register(email, password, firstname, lastname)
      .then(
        user => {
          dispatch(success(user));
          history.push('/dashboard');
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request (user) { return { type: userConstants.REGISTRATION_REQUEST, user }; }
  function success (user) { return { type: userConstants.REGISTRATION_SUCCESS, user }; }
  function failure (error) { return { type: userConstants.REGISTRATION_FAILURE, error }; }
}

function refresh (user) {
  return dispatch => {
    dispatch(request(user));

    userService.refresh(user)
      .then(
        user => {
          dispatch(success(user));
          location.reload();
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request (user) { return { type: userConstants.REFRESH_REQUEST, user }; }
  function success (user) { return { type: userConstants.REFRESH_SUCCESS, user }; }
  function failure (error) { return { type: userConstants.REFRESH_FAILURE, error }; }
}

function addTeams (_user, teams) {
  return dispatch => {
    userService.addTeams(_user, teams)
      .then(
        user => {
          dispatch(success(user));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success (user) { return { type: userConstants.TEAM_ADD_SUCCESS, user }; }
  function failure (error) { return { type: userConstants.TEAM_ADD_FAILURE, error }; }
}
