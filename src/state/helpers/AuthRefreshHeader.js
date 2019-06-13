export function authRefreshHeader(user) {
    // return authorization header with jwt token
    if (user && user.refresh_token) {
        return { 'Authorization': 'Bearer ' + user.refresh_token };
    } else {
        return {};
    }
}