import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';

import Loading from './Loading'

import { userActions } from '../state/actions/user';

import PropTypes from 'prop-types'

/* eslint-disable react/prefer-stateless-function */
class Authenticated extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      loggedIn: false,
      render: ''
    }
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
    
    if(user) {
      this.setState({isLoaded: true, loggedIn: true})
    } else {
      this.setState({isLoaded: true, loggedIn: false})
    }
  }

  componentWillUnmount() {
      this.listener();
  }

  render () {
    if (!this.state.isLoaded) {
      return ( <Loading /> )
    } else {
      return (this.state.loggedIn ? (this.props.is instanceof Function ? this.props.is() : this.props.is) : this.props.not)
    } 
  }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedAuthenticated = connect(mapStateToProps)(Authenticated);
const firebaseAuthenticated = compose(withFirebase)(connectedAuthenticated)
export { firebaseAuthenticated as Authenticated }; 