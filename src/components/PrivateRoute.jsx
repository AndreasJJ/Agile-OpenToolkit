import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Authenticated } from './Authenticated';

const PrivateRoute = ({ component: Component, content: Content, namespace: Namespace, ...rest }) => (
  <Route {...rest} render={(props) => (
    <Authenticated is={<Component content={Content} namespace={Namespace} {...props} />} not={<Redirect to={{pathname: '/login',state: { from: props.location }}} />} />
  )} />
)

export default PrivateRoute;