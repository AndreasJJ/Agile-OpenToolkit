const crypto = require('crypto')

const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

// Firebase http cloud function - Gitlab webhook
const gitlab_webhook = async (req, res) => {
    // End cloud function if it's not a post request
    if(req.method !== "POST") {
        res.end()
      }
      // Query
      const productId = req.query.productId
      // End cloud function if the url doesnt contain the productId
      if(!productId) {
        res.end()
      }
  
      // Headers
      const event = req.get('X-Gitlab-Event')
      const HMAC = req.get('X-Gitlab-Token')
  
      // Data
      const user = req.body.user
      const repo = req.body.repository
  
      // Verification
      const verified = await verify_signature(productId, req.body, HMAC)
  
      // End cloud function if user is not authenticated
      if(!verified) {
          res.end()
      }

    switch(event) {
        case "Issue Hook":
            webhook_issues(productId, req)
            break;
        default:
            res.end()
    }
    res.end()
}

// Issue event handler
const webhook_issues = async (productId, req) => {
    // User object
    const user = req.body.user
    // issue bject
    const issueDetails = req.body.object_attributes

    // Try to get existing story from issueId
    // Returns the story document data or null
    let internalIssue = await get_external_issue(productId, issueDetails.id, 'gitlab')

    // Updated/New issue object
    let story = {
        creator: {
            firstname: user.name ? user.name : user.username,
            lastname: "",
            uid: user.username,
            type: "gitlab"
        },
        description: issueDetails.description,
        dueDate: null,
        labels: {},
        lastEditer: {
            firstname: user.name ? user.name : user.username,
            lastname: "",
            uid: user.username,
            type: "gitlab"
        },
        lastUpdateTimestamp: new Date(issueDetails.updated_at),
        sprint: null,
        status: "OPEN",
        timestamp: new Date(issueDetails.created_at),
        title: issueDetails.title,
        externalId: issueDetails.id,
        externalType: "gitlab"
    }
    // If the issue exists, merge it
    if(internalIssue) {
        await db.collection('products')
                .doc(productId)
                .collection('stories')
                .doc(internalIssue.id)
                .set(story, {merge: true})
    // If the issue doesnt exist, add it
    } else {
        await db.collection('products')
                .doc(productId)
                .collection('stories')
                .add(story)
    }
}

// Verify payload signature
async function verify_signature(productId, payload_body, checksum) {
    // Get product github secret key
    const promise = await db.collection('products')
                      .doc(productId)
                      .collection('config')
                      .doc('secret')
                      .get()

    try {
        const secret = (promise.val()).github
        const payload = JSON.stringify(payload_body)

        const hmac = crypto.createHmac('sha1', secret)
        const digest = 'sha1=' + hmac.update(payload).digest('hex')

        // If the checksum og digest is is false/null/undefined or checksum and digest is not equal
        // Then it is not valid
        if (!checksum || !digest || crypto.timingSafeEqual(checksum, digest)) {
            return false
        }
        return true
    } catch(e) {
        // It is not valid if an error occurs
        return false
    }
}
// Get story from corresponding github issue
async function get_external_issue(productId, externalIssueId, externalType)  {
    // Get issue from firestore
    // Returns array of documents or null
    const promise = await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .where('externalId', '==', externalIssueId)
                      .where('externalType', '==', externalType)
                      .limit(1)
                      .get()
    try{
        // Get first document (The array should never contain more than 1 document)
        let doc = promise.docs[0]
        if(doc) {
          // Add id to the object
          let obj = doc.data()
          obj.id = doc.id
          return obj
        }
        // Return null if it doesnt exist
        return null
    } catch(e) {
        // Error should only occur if null is returned from firebase and thus the issue doesnt exist
        console.log(e)
        return null
    }    
}

module.exports = {
    webhook: gitlab_webhook
}