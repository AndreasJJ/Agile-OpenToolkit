const firebase = require('@firebase/testing');
const fs = require('fs');
/*
 * ============
 *    Setup
 * ============
 */
const projectId = '***REMOVED***';
const firebasePort = require('../../../firebase.json').emulators.firestore.port;
const port = firebasePort || 8082;
const coverageUrl = `https://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;
const rules = fs.readFileSync('./firebase/firestore.rules', 'utf8');

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp (auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */
beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

beforeAll(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

afterAll(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`); // eslint-disable-line no-console
});

describe('Agile Toolkit', () => {
  test('require users to log in before viewing their own profile', async () => {
    const db = authedApp(null);
    const profile = db.collection('users').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');
    await firebase.assertFails(profile.get());
  });

  test('users can only view their own profile', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const notSelf = db.collection('users').doc('ZReBYm2wfMWjYYssEQeJdm2AIlw2');
    const self = db.collection('users').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');
    await firebase.assertFails(notSelf.get());
    await firebase.assertSucceeds(
      self.get()
    );
  });

  test('users can only update their own profile and it has to contain all and only firstname, lastname and email following the given pattern', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('users').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');
    // Set the initial data
    await firebase.assertSucceeds(self.set({
      firstname: 'andreas',
      lastname: 'jonassen',
      email: 'andreasjj@gmail.com'
    }));
    // Check that firstname follows the pattern '[A-Za-z]{3,}'
    await firebase.assertFails(self.update({
      firstname: 'aa',
      lastname: 'jonassen',
      email: 'andreasjj@gmail.com'
    }));
    await firebase.assertFails(self.update({
      firstname: 'andreas1',
      lastname: 'jonassen',
      email: 'andreasjj@gmail.com'
    }));
    // Check that lastname follows the pattern '[A-Za-z]{3,}'
    await firebase.assertFails(self.update({
      firstname: 'andreas',
      lastname: 'jo',
      email: 'andreasjj@gmail.com'
    }));
    await firebase.assertFails(self.update({
      firstname: 'andreas',
      lastname: 'jonassen1',
      email: 'andreasjj@gmail.com'
    }));
    // Check that a user has all three fields 'firstname', 'lastname' and 'email'
    await firebase.assertFails(self.set({
      firstname: 'andreas',
      lastname: 'jonassen'
    }));
    await firebase.assertFails(self.set({
      firstname: 'andreas',
      email: 'andreasjj@gmail.com'
    }));
    await firebase.assertFails(self.set({
      lastname: 'jonassen',
      email: 'andreasjj@gmail.com'
    }));
  });

  test('users can only view their own products', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('users').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');
    const notSelf = db.collection('users').doc('ZReBYm2wfMWjYYssEQeJdm2AIlw2');

    await firebase.assertSucceeds(self.collection('products').get());
    await firebase.assertFails(notSelf.collection('products').get());
  });

  test('users cant add their own products', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('users').doc('QTV2p0djMZTED1jXHxrDMWEEyI92').collection('products');

    await firebase.assertFails(self.add({
      'randomAssId': {
        'title': 'nothing'
      }
    }));
  });

  test('users can only read their own role', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('roles').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');
    const notSelf = db.collection('roles').doc('ZReBYm2wfMWjYYssEQeJdm2AIlw2');

    await firebase.assertSucceeds(self.get());
    await firebase.assertFails(notSelf.get());
  });

  test('users cant edit their own role', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('roles').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');

    await firebase.assertFails(self.set({
      'role': 0
    }));
  });

  test('users can only read their own subscription', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('subscriptions').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');
    const notSelf = db.collection('subscriptions').doc('ZReBYm2wfMWjYYssEQeJdm2AIlw2');

    await firebase.assertSucceeds(self.get());
    await firebase.assertFails(notSelf.get());
  });

  test('users cant edit their own subscription', async () => {
    const db = authedApp({ uid: 'QTV2p0djMZTED1jXHxrDMWEEyI92' });
    const self = db.collection('subscriptions').doc('QTV2p0djMZTED1jXHxrDMWEEyI92');

    await firebase.assertFails(self.set({
      'tier': 0
    }));
  });
});
