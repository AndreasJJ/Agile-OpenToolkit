const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
    admin: admin,
    db: db,
    FieldValue: FieldValue
}