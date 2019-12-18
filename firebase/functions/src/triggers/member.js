const admin = require('./src/admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

// Listen for changes in all documents in the 'products/{product}/members' collection and add it to the users product list
const addProductToUserProductList = async (change, context) => {
    // If the document id is 'members' then we don't need to update anything as it is a stats document meant
    // to easily get a list of all member uid's in the product
    if(context.params.member === "members") {
        return "Information document doesnt need to be updated"
    }

    // If the user is removed from the product
    if(!change.after.exists) {
        // Make a batch write
        let batch = db.batch();

        // Delete the product from the user's product list
        let userRef = db.collection("users").doc(context.params.member).collection('products').doc(context.params.product)
        batch.delete(userRef)

        // Remove the user from the 'member' stats document
        let userInMemberListRef = db.collection('products').doc(context.params.product).collection('members').doc('members')
        batch.update(userInMemberListRef, {list: FieldValue.arrayRemove(context.params.member)}, {merge: true})

        // Run batch write
        return batch.commit().catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    // Get product ref
    let productRef = db.collection('products').doc(context.params.product)

    // Run transaction
    return db.runTransaction((transaction) => {
        // Read the product document
        return transaction.get(productRef).then((doc) => {
            // End transaction if doucment doesnt exist
            if (!doc.exists) {
                return "No product with that id"
            }
            // User's product list product document ref
              let userProductRef = db.collection('users').doc(context.params.member).collection('products').doc(context.params.product)
            // Update user's product list product document with name, description and owner
              transaction.set(userProductRef, {
                  name: doc.data().name,
                  description: doc.data().description,
                  owner: doc.data().owner
              })

            // Products members 'members' stats document ref
              let membersListRef = db.collection('products').doc(context.params.product).collection('members').doc('members')
            // Update the products members 'members' stats document with new member
              transaction.update((membersListRef), {
                  list: FieldValue.arrayUnion({[context.params.member]:{
                      firstname: change.after.get('firstname'),
                      lastname: change.after.get('lastname'),
                      email: change.after.get('email'),
                      profilePicture: change.after.get('profilePicture') ? change.after.get('profilePicture') : null
                  }})
              }, {merge: true})
              return "Success"
        });
    }).catch((error) => {
        console.log("Transaction failed: ", error);
    });
}

module.exports = {
    addProductToUserProductList: addProductToUserProductList
}