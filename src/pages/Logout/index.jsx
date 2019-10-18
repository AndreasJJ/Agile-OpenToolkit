import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../../sharedComponents/Firebase';

import { userActions } from '../../state/actions/user';

const Logout = (props) => {

  useEffect(() => {
    props.firebase.doSignOut()
  })

  return (
    "Logging out"
  );
}

const firebaseLogoutPage = compose(withFirebase)(Logout)
export { firebaseLogoutPage as Logout }; 