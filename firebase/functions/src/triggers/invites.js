const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

const createAndSendInvite = async (change, context) => {
    // Get Invitation code from ref
    let docRef = db.collection('invites').doc()
    let inviteCode = docRef.id

    // Add inviation to invitation collection
    docRef.set({
        productId: context.params.product,
        email: change.after.data().email,
        inviter: change.after.data().inviter,
        timestamp: FieldValue.serverTimestamp()
    })

    // Send invitation to user by email
    // TODO
}

module.exports = {
    createAndSendInvite: createAndSendInvite
}
