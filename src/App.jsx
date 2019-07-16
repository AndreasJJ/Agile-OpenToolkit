import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

import { history } from './state/helpers/history';
import { connect } from 'react-redux';
import { alertActions } from './state/actions/alert';

import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Sprintboard } from './pages/Sprintboard';
import { Backlog } from './pages/Backlog';
import { IssuePage } from './pages/IssuePage';
import { Sprints } from './pages/Sprints';
import { SprintPage } from './pages/SprintPage';
import Planning from './pages/Planning';
import { PlanningPokerGame } from './pages/PlanningPokerGame';
import Retrospective from './pages/Retrospective';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Logout } from './pages/Logout';
import Splash from './pages/Splash';

import Alert from './sharedComponents/Alert'

import Error404 from './pages/404';

import PrivateRoute from './sharedComponents/PrivateRoute';
import OpenRoute from './sharedComponents/OpenRoute';

import GlobalStyle from './global-styles';

class App extends React.Component {
	constructor(props) {
        super(props);

        history.listen(function(location, action) {
            // clear alert on location change
            this.removeAlert();
        }.bind(this));

        this.removeAlert = this.removeAlert.bind(this)
    }

    removeAlert() {
    	const { dispatch } = this.props;
    	dispatch(alertActions.clear());
    }

    render() {
    	return (
			<div>
				{this.props.alert.type ? <Alert alert={this.props.alert} removeToast={this.removeAlert} /> : null}
				<Router history={history}>
				    <Switch>
				      <OpenRoute exact path='/' component={Splash} />
				      <OpenRoute exact path='/login' component={Login} />
				      <OpenRoute exact path='/register' component={Register} />
				      <PrivateRoute exact path='/logout' component={Logout} />
				      <PrivateRoute exact path='/dashboard' component={Dashboard} content={Home} />
				      <PrivateRoute exact path='/backlog' component={Dashboard} content={Backlog} />
				      <PrivateRoute path='/backlog/issue/:id' component={Dashboard} content={IssuePage} />
				      <PrivateRoute exact path='/sprints' component={Dashboard} content={Sprints} />
				      <PrivateRoute path='/sprints/:id' component={Dashboard} content={SprintPage} />
				      <PrivateRoute exact path='/sprintboard' component={Dashboard} content={Sprintboard} />
				      <PrivateRoute exact path='/planning' component={Dashboard} content={Planning} />
				      <PrivateRoute exact path='/planning/game/:id' component={Dashboard} content={PlanningPokerGame} />
				      <PrivateRoute exact path='/retrospective' component={Dashboard} content={Retrospective} />
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