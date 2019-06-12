import { userConstants } from '../constants/user';
import { userService } from '../services/user';
import { alertActions } from './alert';
import { history } from '../helpers/history';

export const userActions = {
    login,
    logout,
    register,
    refresh
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

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

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    history.push('/login');
    return { type: userConstants.LOGOUT };
}

function register(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.register(username, password)
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

    function request(user) { return { type: userConstants.REGISTRATION_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTRATION_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTRATION_FAILURE, error } }
}

function refresh() {
        return dispatch => {
        dispatch(request());

        userService.refresh()
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

    function request(user) { return { type: userConstants.REFRESH_REQUEST, user } }
    function success(user) { return { type: userConstants.REFRESH_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REFRESH_FAILURE, error } }
}
