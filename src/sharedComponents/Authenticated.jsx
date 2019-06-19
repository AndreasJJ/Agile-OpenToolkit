import React from 'react';
import { connect } from 'react-redux';

import Loading from './Loading'

import { userActions } from '../state/actions/user';

import PropTypes from 'prop-types'

/* eslint-disable react/prefer-stateless-function */
class Authenticated extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      render: ''
    }
  }

  componentDidMount() {
    if(this.props.loggedIn) {
      if(this.props.user.expiration_timestamp < (new Date()).getTime()) {
        const { dispatch } = this.props;
        dispatch(userActions.refresh(this.props.user));
        location.reload();
      } else {
        this.setState({isLoaded: true})
      }
    } else {
      this.setState({isLoaded: true})
    }
  }

  render () {
    if (!this.state.isLoaded) {
      return ( <Loading /> )
    } else {
      return (this.props.loggedIn ? (this.props.is instanceof Function ? this.props.is() : this.props.is) : this.props.not)
    } 
  }
}

function mapStateToProps(state) {
    const { loggedIn, user } = state.authentication;
    return {
        loggedIn,
        user
    };
}

const connectedAuthenticated = connect(mapStateToProps)(Authenticated);
export { connectedAuthenticated as Authenticated }; 