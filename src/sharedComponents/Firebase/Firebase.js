import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: '***REMOVED***',
  authDomain: '***REMOVED***',
  databaseURL: '***REMOVED***',
  projectId: '***REMOVED***',
  storageBucket: '***REMOVED***',
  messagingSenderId: '***REMOVED***',
  appId: '***REMOVED***'
};

class Firebase {
  constructor () {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(doc => {
            const dbUser = doc.data();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              phoneNumber: authUser.phoneNumber,
              photoURL: authUser.photoURL,
              ...dbUser
            };

            next(authUser);
          });/* .catch(function (error) {
            console.log('Error getting document:', error);
          }); */
      } else {
        fallback();
      }
    });

  user = uid => this.db.collection(`users`).doc(uid);
}

export default Firebase;
