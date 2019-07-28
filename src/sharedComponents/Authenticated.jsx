import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';

import PropTypes from 'prop-types'

class Authenticated extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      render: ''
    }
  }

  render () {
    return (this.props.user ? (this.props.is instanceof Function ? this.props.is() : this.props.is) : this.props.not)
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