import { authAccessHeader } from '../helpers/AuthAccessHeader';
import { authRefreshHeader } from '../helpers/AuthRefreshHeader';

export const userService = {
    login,
    logout,
    register
};

async function login(username, password) {
    let res = await fetch('http://localhost:5000/auth', {
      method: 'POST',
      body: JSON.stringify({'email': username, 'password': password}),
      crossDomain: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).catch(function(err) {
      console.log(err);
    });

    if (!res.ok) {
        if (res.status === 401) {
            // auto logout if 401 response returned from api
            logout();
            location.reload(true);
        }

        const error = response.statusText;
        return Promise.reject(error);
    }

    let user = await res.json()

    localStorage.setItem('user', JSON.stringify(user));
}

async function logout() {
    await fetch('http://localhost:5000/logout/access', {
          method: 'POST',
          body: null,
          crossDomain: true,
          credentials: "include",
          headers: authAccessHeader(),
        }).catch(function(err) {
          console.log("error:" + err);
        });
    await fetch('http://localhost:5000/logout/refresh', {
          method: 'POST',
          body: null,
          crossDomain: true,
          credentials: "include",
          headers: authRefreshHeader(),
        }).catch(function(err) {
          console.log("error:" + err);
        });

    await localStorage.removeItem('user');
}

async function register(username, password) {
  let res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      body: JSON.stringify({'email': username, 'password': password}),
      crossDomain: true,
      credentials: "include",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).catch(function(err) {
      console.log(err);
    });

  if (!res.ok) {
      if (res.status === 401) {
          // auto logout if 401 response returned from api
          logout();
          location.reload(true);
      }

      const error = response.statusText;
      return Promise.reject(error);
  }

  let user = await res.json()

  localStorage.setItem('user', JSON.stringify(user));
}