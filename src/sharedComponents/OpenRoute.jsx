import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Authenticated } from './Authenticated';

// Route only accessible for non-authenticated user
const OpenRoute = ({ component: Component, finishLoading: FinishLoading, ...rest }) => (
  <Route {...rest} render={(props) => (
    <Authenticated is={<Redirect 
    			   to={{pathname: '/dashboard',state: { from: props.location }}} />} 
    			   not={<Component finishLoading={FinishLoading} {...props} />} 
  	/>
  )} />
)

export default OpenRoute;