const functions = require('firebase-functions');
const admin = require('../../admin.js');
const auth = admin.auth;

// Function to check if a http request is sent by an authorized user
const validateFirebaseIdToken = async (req) => {
    // Check that the contains an authorization header and that it begins with "Bearer "
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.log('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      return null;
    }
  
    // get the Id token from the header
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      return null;
    }
  
    try {
      // Verify the token and get a decoded Id token
      const decodedIdToken = await auth.verifyIdToken(idToken);
      console.log('ID Token correctly decoded', decodedIdToken);

      // Return the decoded id token
      return decodedIdToken;
    } catch (error) {
      // Error during verification of token. Token was not valid.
      console.error(error)
      console.log('Error while verifying Firebase ID token');
      return null;
    }
  };

module.exports = {
  validatedUser: validateFirebaseIdToken
}