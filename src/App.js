import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

import { history } from './state/helpers/history';
import { connect } from 'react-redux';
import { alertActions } from './state/actions/alert';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import Sprintboard from './pages/Sprintboard';
import Backlog from './pages/Backlog';
import Planning from './pages/Planning';
import Retrospective from './pages/Retrospective';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Logout } from './pages/Logout';
import Splash from './pages/Splash';

import Error404 from './pages/404';

import PrivateRoute from './sharedComponents/PrivateRoute';

import GlobalStyle from './global-styles';

class App extends React.Component {
	constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }
    render() {
    	const { alert } = this.props;
    	return (
			<div>
				<Router history={history}>
				    <Switch>
				      <Route exact path='/' component={Splash} />
				      <Route exact path='/login' component={Login} />
				      <Route exact path='/register' component={Register} />
				      <Route exact path='/logout' component={Logout} />
				      <PrivateRoute path='/dashboard' component={Dashboard} content={Home} namespace="home" />
				      <PrivateRoute path='/sprintboard' component={Dashboard} content={Sprintboard} namespace="sprintboard" />
				      <PrivateRoute path='/backlog' component={Dashboard} content={Backlog} namespace="backlog" />
				      <PrivateRoute path='/planning' component={Dashboard} content={Planning} namespace="planningpoker" />
				      <PrivateRoute path='/retrospective' component={Dashboard} content={Retrospective} namespace="retrospective" />
				      <Route component={Error404}/>
				    </Switch>
			    </Router>
			    <GlobalStyle />
		    </div>
		)
	}
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 