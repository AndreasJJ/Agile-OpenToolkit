const crypto = require('crypto')

const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;

const validator = require('./utility/validatedUser.js');

const secret_key_reset_endpoint = async (req, res) => {
    if(req.method !== "POST") {
        res.status(400).send("Bad Request")
    }
    
    // Query
    const productId = req.body.productId
    const serviceType = req.body.type
    if(!productId || !serviceType) {
        res.status(400).send('Bad Request')
    }

    // Check if the requester is authorized
    let user;
    try {
        user = await validator.validatedUser(req)
        if(!user) {
            console.log("No authorized user")
            res.status(403).send('Unauthorized')
        }
    } catch(error) {
        console.error(error)
        res.status(403).send('Unauthorized')
    }

    // Check if the user has sufficient permissions to reset secret key
    try {
        let doc = await db.collection('products')
                           .doc(productId)
                           .collection('roles')
                           .doc(user.uid)
                           .get()
        if(!doc.data()) {
            console.log("Authorized user does not have sufficient permissions")
            res.status(403).send('Unauthorized')
        }
        if(!(doc.data().role > 0)) {
            console.log("Authorized user does not have sufficient permissions")
            res.status(403).send('Unauthorized')
        }
    } catch(error) {
        console.error(error)
        res.status(403).send('Unauthorized')
    }

    try {
        let buffer = crypto.randomBytes(256)
        let key = buffer.toString('hex')

        await db.collection('products')
                .doc(productId)
                .collection('config')
                .doc("secret")
                .set({[serviceType]: key}, {merge: true})
        
        let response = {
            key: key
        }

        res.status(200).send(JSON.stringify(response));
    } catch(error) {
        console.error(error)
        res.status(500).send(error);
    }
}

module.exports = {
    reset: secret_key_reset_endpoint
}