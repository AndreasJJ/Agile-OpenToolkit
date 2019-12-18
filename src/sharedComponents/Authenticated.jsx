import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Renders 'is' if the user is logged in (user object exists) or 'not' if they are nt
const Authenticated = (props) => {
  return (props.user ? (props.is instanceof Function ? props.is() : props.is) : props.not)
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    };
}

Authenticated.proptypes = {
    user: PropTypes.object.isRequired
}

const connectedAuthenticated = connect(mapStateToProps)(Authenticated);
export { connectedAuthenticated as Authenticated }; 