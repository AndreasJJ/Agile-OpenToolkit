import React from 'react';
import { connect } from 'react-redux';

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
    console.log(1)
    if(this.state.user) {
      console.log(2)
      if(JSON.parse(this.state.user).expiration_timestamp < (new Date()).getTime()) {
        console.log(4)
        const { dispatch } = this.props;
        dispatch(userActions.refresh());
      } else {
        console.log(5)
        this.setState({authenticated: true, isLoaded: true})
      }
    } else {
      console.log(3)
      this.setState({authenticated: false, isLoaded: true})
    }
  }

  render () {
    if (!this.state.isLoaded) {
      return ( <div>"Loading"</div> )
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