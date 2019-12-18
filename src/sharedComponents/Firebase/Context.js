import React from 'react';

// Firebase context, can be used with useContext hook
const FirebaseContext = React.createContext(null);

// Can be used with class components with compose
export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
