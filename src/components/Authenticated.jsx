import React from 'react';

import PropTypes from 'prop-types'
import * as Cookies from "js-cookie";

/* eslint-disable react/prefer-stateless-function */
export default class Authenticated extends React.PureComponent {

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
      this.setState({authenticated: true, isLoaded: true})
    } else {
      this.setState({authenticated: false, isLoaded: true})
    }
  }

  render () {
    if (!this.state.isLoaded) {
      return ( "Loading" )
    } else {
      return (this.state.authenticated ? (this.props.is instanceof Function ? this.props.is() : this.props.is) : this.props.not)
    } 
  }
}