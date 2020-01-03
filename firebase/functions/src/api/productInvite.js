const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

const validator = require('./utility/validatedUser.js');

const acceptInviteCode = async (req, res) => {
    // Return bad request if its not a post request
    if(req.method !== "POST") {
        res.status(400).send("Bad Request")
    }

    if(!req.body.invitationCode) {
        res.status(400).send("Bad Request")
    }

    // Check if the requester is authorized
    let user;
    try {
        // Get user object
        user = await validator.validatedUser(req)
        // If user object doesnt exist, return Unauthorized
        if(!user) {
            console.log("No authorized user")
            res.status(403).send('Unauthorized')
        }
    } catch(error) {
        // Return Unauthorized if an error occurs
        console.error(error)
        res.status(403).send('Unauthorized')
    }

    // Get the invitation doucment from the provided code
    let invitation = await db.collection('invites').doc(req.body.invitationCode).get()

    // Check that the user invoking invitation code is the invivted user
    if(user.email !== invitation.data().email) {
        console.log("User invoking invitation code is not the invited user")
        res.status(403).send('Unauthorized')
    }

    // Get date object of NOW
    let date = new Date();
    // add 24 hours
    date.setDate(date.getDate() + 1);

    // Check if invitation code is still valid (codes are valid for 24 hours)
    if(invitation.data().timestamp.toDate() > date) {
        console.log("User invoking invitation code after 24 hours")
        res.status(403).send('Unauthorized, invitation code expired')
    }

    // Run transaction
    db.runTransaction((transaction) => {
        // Refs
        let userRef = db.collection('users').doc(user.uid)
        let memberRef = db.collection('products').doc(invitation.data().productId).collection('members').doc(user.uid)
        let roleRef = db.collection('products').doc(invitation.data().productId).collection('roles').doc(user.uid)
        // Read the product document
        return transaction.get(userRef).then((doc) => {
            // End because user document doesnt exist
            if(!doc && !doc.data()) {
                res.status(403).send('Unauthorized')
            }

            // Get data from user document
            let data = doc.data()
    
            // Add member to members collection in product
            transaction.set(memberRef, {
                email: user.email,
                firstname: data.firstname ? data.firstname : null,
                lastname: data.lastname ? data.lastname : null,
                profilePicture: data.profilePicture ? data.profilePicture : null
            })

            // Add the role to the member in the product
            return transaction.set(roleRef, {
                role: 0
            })
        });
    }).catch((error) => {
        // Return 500 Internal server error if an error occurs during key generation
        console.error(error)
        res.status(500).send(error);
    });

    // Successful product invitation join
    res.status(200).send("Success");
}

module.exports = {
    acceptInviteCode: acceptInviteCode
}