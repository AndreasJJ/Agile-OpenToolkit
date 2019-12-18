import { userConstants } from '../constants/user';
import { userService } from '../services/user';
import { alertActions } from './alert';

export const userActions = {
  setUser
};

// Sets a user in the store
function setUser (user) {
  return dispatch => {
    dispatch(request(user));

    userService.setUser(user)
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

  function request (user) { return { type: userConstants.SET_USER_REQUEST, user }; }
  function success (user) { return { type: userConstants.SET_USER_SUCCESS, user }; }
  function failure (error) { return { type: userConstants.SET_USER_FAILURE, error }; }
}
