import React from 'react';
import { connect } from 'react-redux';

import { userActions } from '../../state/actions/user';

class Logout extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
      dispatch(userActions.logout(this.props.user));
  }

  render() {
    return (
      "Logging out"
    );
  }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedLogoutPage = connect(mapStateToProps)(Logout);
export { connectedLogoutPage as Logout }; 