import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Authenticated } from './Authenticated';

const PrivateRoute = ({ component: Component, content: Content, finishLoading: FinishLoading, ...rest }) => (
  <Route {...rest} render={(props) => (
  	<Authenticated is={<Component content={Content} finishLoading={FinishLoading} {...props} />} not={<Redirect to={{pathname: '/login',state: { from: props.location }}} />} />
  )} />
)

export default PrivateRoute;