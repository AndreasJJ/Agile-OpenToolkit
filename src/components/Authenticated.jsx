import React from 'react';
import { connect } from 'react-redux';

import Loading from './Loading'

import { userActions } from '../state/actions/user';

import PropTypes from 'prop-types'
import * as Cookies from "js-cookie";

/* eslint-disable react/prefer-stateless-function */
class Authenticated extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      user: localStorage.getItem('user'),
      isLoaded: false,
      render: ''
    }
  }

  componentDidMount() {
    if(this.state.user) {
      if(JSON.parse(this.state.user).expiration_timestamp < (new Date()).getTime()) {
        const { dispatch } = this.props;
        dispatch(userActions.refresh());
      } else {
        this.setState({authenticated: true, isLoaded: true})
      }
    } else {
      this.setState({authenticated: false, isLoaded: true})
    }
  }

  render () {
    if (!this.state.isLoaded) {
      return ( <Loading /> )
    } else {
      return (this.state.authenticated ? (this.props.is instanceof Function ? this.props.is() : this.props.is) : this.props.not)
    } 
  }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedAuthenticated = connect(mapStateToProps)(Authenticated);
export { connectedAuthenticated as Authenticated }; 