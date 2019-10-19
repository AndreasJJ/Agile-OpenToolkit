import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from './sharedComponents/Firebase';

import { history } from './state/helpers/history';
import { connect } from 'react-redux';
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

class App extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
	      isLoading: true
	    };
	    .
        history.listen(function(location, action) {
            // clear alert on location change
            this.setState({isLoading: true})
            this.removeAlert();
        }.bind(this));

        this.finishLoading = this.finishLoading.bind(this)
        this.removeAlert = this.removeAlert.bind(this)
    }

    componentDidMount() {
	   	const {dispatch, user} = this.props

	    this.listener = this.props.firebase.onAuthUserListener(
	      authUser => {
	        dispatch(userActions.setUser(authUser));
	      },
	      () => {
	        dispatch(userActions.setUser(null));
	      },
	    );
    }

    componentWillUnmount() {
      this.listener();
  	}

    finishLoading() {
    	this.setState({isLoading: false})
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
					<Route
			          render={({ location }) => (
			            <React.Fragment>
			            	<Loader isLoading={this.state.isLoading} location={location} />
			            	<Switch>
						      <OpenRoute exact path='/' component={Splash} finishLoading={this.finishLoading} />
						      <OpenRoute exact path='/login' component={Login} finishLoading={this.finishLoading} />
						      <OpenRoute exact path='/register' component={Register} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/logout' component={Logout} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/dashboard' component={Dashboard} content={Home} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/overview' component={Dashboard} content={Overview} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/backlog' component={Dashboard} content={Backlog} finishLoading={this.finishLoading} />
						      <PrivateRoute path='/backlog/issue/:id' component={Dashboard} content={IssuePage} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/labels' component={Dashboard} content={Labels} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/sprints' component={Dashboard} content={Sprints} finishLoading={this.finishLoading} />
						      <PrivateRoute path='/sprints/:id' component={Dashboard} content={SprintPage} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/sprintboard' component={Dashboard} content={Sprintboard} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/planning' component={Dashboard} content={Planning} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/planning/game/:id' component={Dashboard} content={PlanningPokerGame} finishLoading={this.finishLoading} />
						      <PrivateRoute exact path='/retrospective' component={Dashboard} content={Retrospective} finishLoading={this.finishLoading} />
						      <Route render={(props) => (<Error404 finishLoading={this.finishLoading} {...props} />)} />
						    </Switch>
			            </React.Fragment>
			          )} />
				    
			    </Router>
			    <GlobalStyle />
		    </div>
		)
	}
}

function mapStateToProps(state) {
    const { alert } = state;
    const { user } = state.authentication;
    return {
        alert,
        user
    };
}

const connectedApp = connect(mapStateToProps)(App);
const firebaseApp = compose(withFirebase)(connectedApp)
export { firebaseApp as App }; 