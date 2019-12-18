const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth()
const FieldValue = require('firebase-admin').firestore.FieldValue;

// Export firebease admin object, firestore object (db), auth object and fieldvalue object
module.exports = {
    admin: admin,
    db: db,
    auth: auth,
    FieldValue: FieldValue
}