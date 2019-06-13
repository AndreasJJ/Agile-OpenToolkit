import { authAccessHeader } from '../helpers/AuthAccessHeader';
import { authRefreshHeader } from '../helpers/AuthRefreshHeader';

export const userService = {
    login,
    logout,
    register,
    refresh,
    addTeams
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

    return user
}

async function logout(user) {
    await fetch('http://localhost:5000/logout/access', {
          method: 'POST',
          body: null,
          crossDomain: true,
          credentials: "include",
          headers: authAccessHeader(user),
        }).catch(function(err) {
          console.log("error:" + err);
        });
    await fetch('http://localhost:5000/logout/refresh', {
          method: 'POST',
          body: null,
          crossDomain: true,
          credentials: "include",
          headers: authRefreshHeader(user),
        }).catch(function(err) {
          console.log("error:" + err);
        });
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

  return user
}

async function refresh(user) {
  let res = await fetch('http://localhost:5000/refresh', {
      method: 'POST',
      body: null,
      crossDomain: true,
      credentials: "include",
      headers: authRefreshHeader(user),
    }).catch(function(err) {
      console.log(err);
    });

  if (!res.ok) {
    console.log(res)
      if (res.status === 401) {
          // auto logout if 401 response returned from api
          logout();
          location.reload(true);
      }

      const error = response.statusText;
      return Promise.reject(error);
  }

  let access_token_info = await res.json()

  user.access_token = access_token_info.access_token
  user.creation_timestamp = access_token_info.creation_timestamp
  user.expiration_timestamp = access_token_info.expiration_timestamp

  return user
}

async function addTeams(user, teams) {
  user.teams = teams
  return user
}