import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Config data for firebase project
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
    // Initialize firebase app
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    
    this.EmailAuthProvider = app.auth.EmailAuthProvider;
  }

  // Registration function with email and password
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  // Login function with email and password
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  
  // ReAuthenticate user with email and password
  doReauthenticateWithCredential = (credentials) =>
    this.auth.currentUser.reauthenticateWithCredential(credentials);

  // Create email credentials
  doCreateEmailAuthCredentials = (email, password) => this.EmailAuthProvider.credential(
    email, 
    password
  );

  // Signout function
  doSignOut = () => this.auth.signOut();

  // Email update function
  doUpdateEmail = email => this.auth.currentUser.updateEmail(email);

  // Reset function
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // Password update function with new password
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // Get Id token function (forceRefresh => true or false)
  doGetIdToken = forceRefresh => this.auth.currentUser.getIdToken(forceRefresh)

  // Auth listener. Fires function on auth change
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // Get user document
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

  // User document ref
  user = uid => this.db.collection(`users`).doc(uid);
}

export default Firebase;
