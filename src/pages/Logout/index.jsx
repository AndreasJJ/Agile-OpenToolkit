import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import { userActions } from '../../state/actions/user';

class Logout extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
    };
  }

  componentDidMount() {
    this.props.firebase.doSignOut()
  }

  render() {
    return (
      "Logging out"
    );
  }
}

const firebaseLogoutPage = compose(withFirebase)(Logout)
export { firebaseLogoutPage as Logout }; 