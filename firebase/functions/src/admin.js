const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth()
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
    admin: admin,
    db: db,
    auth: auth,
    FieldValue: FieldValue
}