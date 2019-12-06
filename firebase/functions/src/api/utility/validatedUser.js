const functions = require('firebase-functions');
const admin = require('../../admin.js');
const auth = admin.auth;

const validateFirebaseIdToken = async (req) => {
  
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.log('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      return null;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      return null;
    }
  
    try {
      const decodedIdToken = await auth.verifyIdToken(idToken);
      console.log('ID Token correctly decoded', decodedIdToken);

      return decodedIdToken;
    } catch (error) {
      console.error(error)
      console.log('Error while verifying Firebase ID token');
      return null;
    }
  };

  module.exports = {
    validatedUser: validateFirebaseIdToken
}