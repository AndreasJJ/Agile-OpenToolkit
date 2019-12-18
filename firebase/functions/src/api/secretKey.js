const crypto = require('crypto')

const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;

const validator = require('./utility/validatedUser.js');

// Firebase http cloud function - Secret key creation endpoint
const secret_key_reset_endpoint = async (req, res) => {
    // Return bad request if its not a post request
    if(req.method !== "POST") {
        res.status(400).send("Bad Request")
    }
    
    // Query
    const productId = req.body.productId
    // secret key type
    const serviceType = req.body.type
    // Return bad request if either is empty
    if(!productId || !serviceType) {
        res.status(400).send('Bad Request')
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

    // Check if the user has sufficient permissions to reset secret key
    try {
        // Get user object from firestore
        let doc = await db.collection('products')
                           .doc(productId)
                           .collection('roles')
                           .doc(user.uid)
                           .get()
        // Return Unauthorized if user doesnt exist
        if(!doc.data()) {
            console.log("Authorized user does not have sufficient permissions")
            res.status(403).send('Unauthorized')
        }
        // Return Unauthorized if the user doesnt have sufficient role to get secret key
        if(!(doc.data().role > 0)) {
            console.log("Authorized user does not have sufficient permissions")
            res.status(403).send('Unauthorized')
        }
    } catch(error) {
        // Return Unauthorized if an error occurs
        console.error(error)
        res.status(403).send('Unauthorized')
    }

    try {
        // Get random bytes buffer
        let buffer = crypto.randomBytes(256)
        // Get random strign from buffer
        let key = buffer.toString('hex')

        // Set secret key (type specfied in request) to generated key
        await db.collection('products')
                .doc(productId)
                .collection('config')
                .doc("secret")
                .set({[serviceType]: key}, {merge: true})
        
        let response = {
            key: key
        }
        // Send key and 200 response back
        res.status(200).send(JSON.stringify(response));
    } catch(error) {
        // Return 500 Internal server error if an error occurs during key generation
        console.error(error)
        res.status(500).send(error);
    }
}

module.exports = {
    reset: secret_key_reset_endpoint
}