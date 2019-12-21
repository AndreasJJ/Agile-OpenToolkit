import React, {useState, useEffect, useContext} from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { FirebaseContext } from './sharedComponents/Firebase';

import { history } from './state/helpers/history';
import { useSelector, useDispatch } from 'react-redux';
import { alertActions } from './state/actions/alert';
import { userActions } from './state/actions/user';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Overview } from './pages/Overview';
import { Sprintboard } from './pages/Sprintboard';
import { Backlog } from './pages/Backlog';
import { Labels } from './pages/Labels';
import { IssuePage } from './pages/IssuePage';
import { Sprints } from './pages/Sprints';
import { SprintPage } from './pages/SprintPage';
import Planning from './pages/Planning';
import { PlanningPokerGame } from './pages/PlanningPokerGame';
import Retrospective from './pages/Retrospective';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Logout } from './pages/Logout';
import Splash from './pages/Splash';

import Loader from './sharedComponents/Loader';

import Alert from './sharedComponents/Alert'

import Error404 from './pages/404';

import PrivateRoute from './sharedComponents/PrivateRoute';
import OpenRoute from './sharedComponents/OpenRoute';

import GlobalStyle from './global-styles';
import styled from 'styled-components';

const Wrapper = styled.div`
	height: 100%;
	width: 100%;
`

const App = (props) => {
    const firebase = useContext(FirebaseContext)
    const dispatch = useDispatch()

    const alert = useSelector(state => state.alert)

    const [isLoading, setIsLoading] = useState(true)
    let listener = null

    useEffect(() => {
		// clear alert on location change
        history.listen((location, action) => {
            setIsLoading(true)
            removeAlert();
        });

		// Dispatch setUser on auth change
        listener = firebase.onAuthUserListener(
          authUser => {
            dispatch(userActions.setUser(authUser));
          },
          () => {
            dispatch(userActions.setUser(null));
          },
        );

        return () => {
            listener()
        }
    }, [])

	// callback to finish loader
    const finishLoading = () => {
        setIsLoading(false)
    }

	// callback to remove alert
    const removeAlert = () => {
    	dispatch(alertActions.clear());
    }

	return (
		<Wrapper>
			{alert.type ? <Alert alert={alert} removeToast={removeAlert} /> : null}
			<Router history={history}>
				<Route
		          render={({ location }) => (
		            <React.Fragment>
		            	<Loader isLoading={isLoading} location={location} />
		            	<Switch>
					      <OpenRoute exact path='/' component={Splash} finishLoading={finishLoading} />
					      <OpenRoute exact path='/login' component={Login} finishLoading={finishLoading} />
					      <OpenRoute exact path='/register' component={Register} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/logout' component={Logout} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/dashboard' component={Dashboard} content={Home} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/overview' component={Dashboard} content={Overview} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/backlog' component={Dashboard} content={Backlog} finishLoading={finishLoading} />
					      <PrivateRoute path='/backlog/issue/:id' component={Dashboard} content={IssuePage} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/labels' component={Dashboard} content={Labels} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/sprints' component={Dashboard} content={Sprints} finishLoading={finishLoading} />
					      <PrivateRoute path='/sprints/:id' component={Dashboard} content={SprintPage} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/sprintboard' component={Dashboard} content={Sprintboard} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/planning' component={Dashboard} content={Planning} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/planning/game/:id' component={Dashboard} content={PlanningPokerGame} finishLoading={finishLoading} />
					      <PrivateRoute exact path='/retrospective' component={Dashboard} content={Retrospective} finishLoading={finishLoading} />
						  <PrivateRoute exact path='/settings' component={Dashboard} content={Settings} finishLoading={finishLoading} />
					      <Route render={(props) => (<Error404 finishLoading={finishLoading} {...props} />)} />
					    </Switch>
		            </React.Fragment>
		          )} />
			    
		    </Router>
		    <GlobalStyle />
	    </Wrapper>
		)
}

export {App}; 