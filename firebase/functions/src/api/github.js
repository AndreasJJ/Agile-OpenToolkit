const crypto = require('crypto')

const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

const github_webhook = async (req, res) => {
    if(req.method !== "POST") {
      res.end()
    }
    // Query
    const productId = req.query.productId

    if(!productId) {
      res.end()
    }

    // Headers
    const event = req.get('X-GitHub-Event')
    const GUID = req.get('X-GitHub-Delivery')
    const HMAC = req.get('X-Hub-Signature')

    // Data
    const user = req.body.sender
    const repo = req.body.repository

    // Action
    const action = req.body.action

    // Verification
    const verified = await verify_signature(productId, req.body, HMAC)

    if(!verified) {
        res.end()
    }

    switch(event) {
        case "issues":
            webhook_issues(productId, req)
            break;
        case "milestone":
            webhook_milestone(productId, req)
            break;
        case "label":
            webhook_label(productId, req)
            break;
        default:
            res.end()
    }
    res.end()
}

const webhook_issues = async (productId, req) => {
    // Try to get internal issue
    let internalIssue = await get_external_issue(productId, req.body.issue.id, 'github')
    let action = req.body.action

    // Action Handler
    switch(action) {
        case "opened":
            if(!internalIssue) {
                let story = {
                    creator: {
                        firstname: req.body.issue.user.login,
                        lastname: "",
                        uid: req.body.issue.user.id,
                        type: "github"
                    },
                    description: req.body.issue.body ? req.body.issue.body : null,
                    dueDate: null,
                    labels: {},
                    lastEditer: {
                        firstname: req.body.issue.user.login,
                        lastname: "",
                        uid: req.body.issue.user.id,
                        type: "github"
                    },
                    lastUpdateTimestamp: new Date(req.body.issue.updated_at),
                    sprint: null,
                    status: "OPEN",
                    timestamp: new Date(req.body.issue.created_at),
                    title: req.body.issue.title,
                    externalId: req.body.issue.id,
                    externalType: "github"
                }

                if(req.body.issue.milestone) {
                    let internalSprintId = await get_external_sprint(productId, res.body.issue.milestone, 'github')
                    story.sprint = internalSprintId
                }

                await db.collection('products')
                        .doc(productId)
                        .collection('stories')
                        .add(story)
            }
            break;
        case "edited":
            if(internalIssue) {
                let update = {
                  lastUpdateTimestamp: new Date(req.body.issue.updated_at),
                  lastEditer: {
                      firstname: req.body.issue.user.login,
                      lastname: "",
                      uid: req.body.issue.user.id,
                      type: "github"
                  }
                }

                for(let element of Object.keys(req.body.changes)) {
                  if(element === "creator") {
                    update.creator = {
                      firstname: req.body.issue.user.login,
                      lastname: "",
                      uid: req.body.issue.user.id,
                      type: "github"
                    }
                  } else if(element === "body") {
                    update.description = req.body.issue.body ? req.body.issue.body : null
                  } else if(element === "title") {
                    update.title = req.body.issue.title
                  }
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "deleted":
            if(internalIssue) {
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .delete()
            }
            break;
        case "closed":
            if(internalIssue) {
                let update = {
                    status: "CLOSED"
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "reopened":
            if(internalIssue) {
                let update = {
                    status: "OPEN"
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "assigned":
            break;
        case "unassigned":
            break;
        case "labeled":
            if(internalIssue) {
                // TODO: Add a check so that you can't add labels that don't exist in the product on agiletoolkit
                const labels = {}
                for(let label of req.body.issue.labels) {
                  labels[label.name] = {
                    color: label.color,
                    description: ""
                  }
                }

                let update = {
                    labels: labels 
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "unlabeled":
            if(internalIssue) {
                const labels = {}
                for(let label of req.body.issue.labels) {
                  labels[label.name] = {
                    color: label.color,
                    description: ""
                  }
                }

                let update = {
                    labels: labels 
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "locked":
            break;
        case "unlocked":
            break;
        case "transferred":
            break;
        case "milestoned":
            if(internalIssue) {
                let internalSprint = await get_external_sprint(productId, req.body.issue.milestone.id, 'github')
                
                update = {
                    sprint: internalSprint.id
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "demilestoned":
            if(internalIssue) {
                let update = {
                    sprint: null
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "pinned":
            break;
        case "unpinned":
            break;
    }
}

const webhook_milestone = async (productId, req) => {
    let interntalSprint = await get_external_sprint(productId, req.body.milestone.id, 'github')
    let action = req.body.action

    // Action Handler
    switch(action) {
        case "created":
            // Creation of a sprint
            if(!interntalSprint) {
                let sprint = {
                    title: req.body.milestone.title,
                    description: req.body.milestone.description,
                    startDate: new Date(req.body.milestone.created_at),
                    dueDate: req.body.milestone.due_on ? new Date(req.body.milestone.due_on) : null,
                    externalId: req.body.milestone.id,
                    externalType: "github"
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('sprints')
                      .add(sprint)
            }
            break;
        case "edited":
            if(interntalSprint) {
                let update = {
                    title: req.body.milestone.title,
                    description: req.body.milestone.description,
                    startDate: new Date(req.body.milestone.created_at),
                    dueDate: req.body.milestone.due_on ? new Date(req.body.milestone.due_on) : null
                }
                await db.collection('products')
                      .doc(productId)
                      .collection('sprints')
                      .doc(interntalSprint.id)
                      .update(sprint)
            }
            break;
        case "deleted":
            // Deletation of a sprint
            if(interntalSprint) {
                await db.collection('products')
                      .doc(productId)
                      .collection('sprints')
                      .doc(interntalSprint.id)
                      .delete()
            }
            break;
        // "Opened" and "Closed" actions are supported. Only due dates
        case "closed":
          break;
        case "opened":
          break;
    }
}

const webhook_label = async (productId, req) => {
    // Internal label
    let currentLabelName = req.body.label.name
    let currentLabelBody = {
        color: req.body.label.color
    }
    let labelExists = await get_external_label(productId, currentLabelName, currentLabelBody, 'github')
    let action = req.body.action

    // Action Handler
    switch(action) {
        case "created":
            if(!labelExists) {
                let label = {
                    ["list." + req.body.label.name]: {
                        color: req.body.label.color
                    }
                }

                await db.collection('products')
                      .doc(productId)
                      .collection('labels')
                      .doc('list')
                      .update(label)
            }
            break;
        case "edited": {
          let labelName = req.body.changes.name ? req.body.changes.name.from : req.body.label.name
          let labelBody = {
                color: req.body.changes.color ? req.body.changes.color.from : req.body.label.color
          }

          let oldLabelExists = await get_external_label(productId, labelName, labelBody, 'github')
          
          if(oldLabelExists) {
              if(req.body.changes.name) {
                  await db.collection('products')
                    .doc(productId)
                    .collection('labels')
                    .doc('list')
                    .update({
                      ["list." + req.body.changes.name.from]: FieldValue.delete()
                    })
              }

              let label = {
                  ["list." + req.body.label.name]: {
                      color: req.body.label.color
                  }
              }

              await db.collection('products')
                    .doc(productId)
                    .collection('labels')
                    .doc('list')
                    .update(label)
          }
          break;
        }
        case "deleted":
            if(labelExists) {
                await db.collection('products')
                      .doc(productId)
                      .collection('labels')
                      .doc('list')
                      .update({
                          ["list." + req.body.label.name]: FieldValue.delete()
                      })
            }
            break;
    }
}

/*
const webhook_issue_comment = functions.https.onRequest(async (req, res) => {
    // Action Handler
    switch(action) {
        case "created":
            break;
        case "edited":
            break;
        case "deleted":
            break;
        default:
            res.end()
    }

});
*/

/*
const webhook_member = functions.https.onRequest(async (req, res) => {
    if(method !== "POST") {
      res.end()
    }
    // Query
    const productId = req.query.productId

    // Headers
    const event = req.get('X-GitHub-Event')
    const GUID = req.get('X-GitHub-Delivery')
    const HMAC = req.get('X-Hub-Signature')

    // Data
    const user = req.body.sender
    const repo = req.body.repository

    // Verification
    const verified = await verify_signature(productId, req.body, HMAC)
    if(!verified) {
        res.end()
    }
});
*/

/*
const webhook_membership = functions.https.onRequest((req, res) => {
    if(!isMethodPost(req.method)) {
      res.end()
    }
    const event = req.get('X-GitHub-Event')
    const GUID = req.get('X-GitHub-Delivery')
    const HMAC = req.get('X-Hub-Signature')
});
*/

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

async function get_external_sprint(productId, externalMilstoneId, externalType) {
    const promise = await db.collection('products')
                            .doc(productId)
                            .collection('sprints')
                            .where('externalId', '==', externalMilstoneId)
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

async function get_external_label(productId, externalLabelTitle, externalLabelBody, externalType) {
    const promise = await db.collection('products')
                            .doc(productId)
                            .collection('labels')
                            .where('list.' + externalLabelTitle, '==', externalLabelBody)
                            .limit(1)
                            .get()

    try{
      let label = promise.docs[0]
      if(label) {
        label = label.data()
        return label
      }
      return null
    } catch(e) {
        console.log(e)
        return null
    }                        
}

module.exports = {
    webhook: github_webhook
}
