import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Authenticated } from './Authenticated';

const OpenRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    <Authenticated is={<Redirect to={{pathname: '/dashboard',state: { from: props.location }}} />} not={<Component {...props} />} />
  )} />
)

export default OpenRoute;