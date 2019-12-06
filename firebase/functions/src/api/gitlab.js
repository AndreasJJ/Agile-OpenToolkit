const crypto = require('crypto')

const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

const gitlab_webhook = async (req, res) => {
    if(req.method !== "POST") {
        res.end()
      }
      // Query
      const productId = req.query.productId
  
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

const webhook_issues = async (productId, req) => {
    const user = req.body.user
    const issueDetails = req.body.object_attributes

    let internalIssue = await get_external_issue(productId, issueDetails.id, 'gitlab')

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

    if(internalIssue) {
        await db.collection('products')
                .doc(productId)
                .collection('stories')
                .doc(internalIssue.id)
                .set(story, {merge: true})
    } else {
        await db.collection('products')
                .doc(productId)
                .collection('stories')
                .add(story)
    }
}

async function verify_signature(productId, payload_body, checksum) {
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

        if (!checksum || !digest || crypto.timingSafeEqual(checksum, digest)) {
            return false
        }
        return true
    } catch(e) {
        return false
    }
}

async function get_external_issue(productId, externalIssueId, externalType)  {
    const promise = await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .where('externalId', '==', externalIssueId)
                      .where('externalType', '==', externalType)
                      .limit(1)
                      .get()
    try{
        let doc = promise.docs[0]
        if(doc) {
          let obj = doc.data()
          obj.id = doc.id
          return obj
        }
        return null
    } catch(e) {
        console.log(e)
        return null
    }    
}

module.exports = {
    webhook: gitlab_webhook
}