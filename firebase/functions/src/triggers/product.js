const admin = require('./src/admin.js');
const db = admin.db;

// Listen for updates in all documents in the 'products' collection and updates the all the users who has it in their product list
const updateProductInfo = async (change, context) => {
    // Document after change
    const newDoc = change.after.data();

    // Product's members collection ref
    let productRef = db.collection('products').doc(context.params.product).collection('members')

    // Run transaction
    return db.runTransaction((transaction) => {
        // Read product's members collection ref
        return transaction.get(productRef).then((snapshot) => {
            // End transaction if no members to be updated
            if (!snapshot.exists) {
                return "no members to update"
            }
                // For each member, update their product list product document with updated information
                return snapshot.forEach((member) => {
                  // User's product list product document ref
                  let userProductRef = db.collection('users').doc(member.id).collection('products').doc(context.params.product)
                
                  // Update product list product document
                  transaction.update(userProductRef, {
                    name: newDoc.name,
                    description: newDoc.description,
                    owner: newDoc.owner
                }, {merge: true})
              })
        });
    }).catch((error) => {
        console.log("Transaction failed: ", error);
    });
}

module.exports = {
    updateProductInfo: updateProductInfo
}