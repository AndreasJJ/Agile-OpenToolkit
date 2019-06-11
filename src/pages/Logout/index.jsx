import React from 'react';
import { connect } from 'react-redux';

import { userActions } from '../../state/actions/user';

/* eslint-disable react/prefer-stateless-function */
class Logout extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
      dispatch(userActions.logout());
  }

  render() {
    return (
      "Logging out"
    );
  }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLogoutPage = connect(mapStateToProps)(Logout);
export { connectedLogoutPage as Logout }; 