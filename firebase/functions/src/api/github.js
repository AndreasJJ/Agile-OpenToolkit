const crypto = require('crypto')

const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

// Firebase http cloud function - Github webhook
const github_webhook = async (req, res) => {
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

    // End cloud function if user is not authenticated
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

// Issue event handler
const webhook_issues = async (productId, req) => {
    // Try to get existing story from issueId
    // Returns the story document data or null
    let internalIssue = await get_external_issue(productId, req.body.issue.id, 'github')

    let action = req.body.action

    // Action Handler depending on the action done on the issue
    switch(action) {
        case "opened":
            if(!internalIssue) {
                // New story data
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

                // If the github milestone exists then get the sprintId from the github milestoneId
                if(req.body.issue.milestone) {
                    let internalSprintId = await get_external_sprint(productId, res.body.issue.milestone, 'github')
                    story.sprint = internalSprintId
                }

                // Add story to database
                await db.collection('products')
                        .doc(productId)
                        .collection('stories')
                        .add(story)
            }
            break;
        case "edited":
            // Only do edit action if story exists in the database
            if(internalIssue) {
                // Updated information
                let update = {
                  lastUpdateTimestamp: new Date(req.body.issue.updated_at),
                  lastEditer: {
                      firstname: req.body.issue.user.login,
                      lastname: "",
                      uid: req.body.issue.user.id,
                      type: "github"
                  }
                }

                // Loop over all the elements in the change array
                // Add approperiate info to the update oject
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
                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "deleted":
            // Only do delete action if story exists in the database
            if(internalIssue) {
                // Delete story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .delete()
            }
            break;
        case "closed":
            // Only do close action if story exists in the database
            if(internalIssue) {
                // Updated status
                // TODO: Check if we need to add lastEditor and timestamp
                let update = {
                    status: "CLOSED"
                }

                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "reopened":
            // Only do reopened action if story exists in the database
            if(internalIssue) {
                // Updated status
                // TODO: Check if we need to add lastEditor and timestamp
                let update = {
                    status: "OPEN"
                }

                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        // Action not supported
        case "assigned":
            break;
        // Action not supported
        case "unassigned":
            break;
        // Action not supported
        case "labeled":
            // Only do labeled action if story exists in the database
            if(internalIssue) {
                // TODO: Add a check so that you can't add labels that don't exist in the product on agiletoolkit
                const labels = {}
                // loop over all the labels and add label objects to the dictionary.
                for(let label of req.body.issue.labels) {
                  labels[label.name] = {
                    color: label.color,
                    description: ""
                  }
                }

                // Updated selected labels
                // TODO: Check if we need to add lastEditor and timestamp
                let update = {
                    labels: labels 
                }

                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "unlabeled":
            // Only to unlabeled action if story exists in the database
            if(internalIssue) {
                const labels = {}
                // loop over all the labels and add label objects to the dictionary.
                for(let label of req.body.issue.labels) {
                  labels[label.name] = {
                    color: label.color,
                    description: ""
                  }
                }

                // Updated selected labels
                // TODO: Check if we need to add lastEditor and timestamp
                let update = {
                    labels: labels 
                }

                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        // Action not supported
        case "locked":
            break;
        // Action not supported
        case "unlocked":
            break;
        // Action not supported
        case "transferred":
            break;
        // Action not supported
        case "milestoned":
            // Only to milestoned action if story exists in the database
            if(internalIssue) {
                // Check if the milestone exists by trying to get the corresponding sprint
                // Returns the sprint document data or null
                let internalSprint = await get_external_sprint(productId, req.body.issue.milestone.id, 'github')
                
                // Updated sprint
                update = {
                    sprint: internalSprint.id
                }

                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        case "demilestoned":
            // Only to demilestoned action if story exists in the database
            if(internalIssue) {
                // Updated sprint is set to null as milestone is removed
                let update = {
                    sprint: null
                }

                // Update story
                await db.collection('products')
                      .doc(productId)
                      .collection('stories')
                      .doc(internalIssue.id)
                      .update(update)
            }
            break;
        // Action not supported
        case "pinned":
            break;
        // Action not supported
        case "unpinned":
            break;
    }
}

// Milestone event handler
const webhook_milestone = async (productId, req) => {
    // Tries to get the sprint corresponding to the milestone
    // Returns the sprint document data or null
    let interntalSprint = await get_external_sprint(productId, req.body.milestone.id, 'github')

    // Action
    let action = req.body.action

    // Action Handler
    switch(action) {
        case "created":
            // Only create a new sprint if a sprint isnt already connected to the milestone
            if(!interntalSprint) {
                // New sprint
                let sprint = {
                    title: req.body.milestone.title,
                    description: req.body.milestone.description,
                    startDate: new Date(req.body.milestone.created_at),
                    dueDate: req.body.milestone.due_on ? new Date(req.body.milestone.due_on) : null,
                    externalId: req.body.milestone.id,
                    externalType: "github"
                }

                // Add sprint to database
                await db.collection('products')
                      .doc(productId)
                      .collection('sprints')
                      .add(sprint)
            }
            break;
        case "edited":
            // Only edit sprint if it exists in the database
            if(interntalSprint) {
                // Updated sprint
                let update = {
                    title: req.body.milestone.title,
                    description: req.body.milestone.description,
                    startDate: new Date(req.body.milestone.created_at),
                    dueDate: req.body.milestone.due_on ? new Date(req.body.milestone.due_on) : null
                }
                // Update sprint
                await db.collection('products')
                      .doc(productId)
                      .collection('sprints')
                      .doc(interntalSprint.id)
                      .update(sprint)
            }
            break;
        case "deleted":
            // Only delete sprint if it exists in the database
            if(interntalSprint) {
                // Delete sprint
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

// Label event handler
const webhook_label = async (productId, req) => {
    // Label name
    let currentLabelName = req.body.label.name
    // Label body
    let currentLabelBody = {
        color: req.body.label.color
    }
    // Check if label exists in the database
    let labelExists = await get_external_label(productId, currentLabelName, currentLabelBody, 'github')
    // Action
    let action = req.body.action
    // Action Handler
    switch(action) {
        case "created":
            // Only add label if it doesnt exist in the database
            if(!labelExists) {
                // Label array element
                // This form is needed to do an union operator on the existing array named list in firestore
                let label = {
                    ["list." + req.body.label.name]: {
                        color: req.body.label.color
                    }
                }
                // Add label
                await db.collection('products')
                      .doc(productId)
                      .collection('labels')
                      .doc('list')
                      .update(label)
            }
            break;
        case "edited": {
          // Old label name
          let labelName = req.body.changes.name ? req.body.changes.name.from : req.body.label.name
          // Old label body
          let labelBody = {
                color: req.body.changes.color ? req.body.changes.color.from : req.body.label.color
          }
          // Check if the old label exists
          let oldLabelExists = await get_external_label(productId, labelName, labelBody, 'github')
          
          if(oldLabelExists) {
              if(req.body.changes.name) {
                  // Delete old label
                  await db.collection('products')
                    .doc(productId)
                    .collection('labels')
                    .doc('list')
                    .update({
                      ["list." + req.body.changes.name.from]: FieldValue.delete()
                    })
              }

              // Label array element
              // This form is needed to do an union operator on the existing array named list in firestore
              let label = {
                  ["list." + req.body.label.name]: {
                      color: req.body.label.color
                  }
              }

              // Add updated label to database
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
                // Delete label by updating the label entry with filedvalue delete function
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

// Get sprint from corresponding github milestone
async function get_external_sprint(productId, externalMilstoneId, externalType) {
    // Get sprint from firestore
    // Returns array of documents or null
    const promise = await db.collection('products')
                            .doc(productId)
                            .collection('sprints')
                            .where('externalId', '==', externalMilstoneId)
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
        // Error should only occur if null is returned from firebase and thus the sprint doesnt exist
        console.log(e)
        return null
    }  
}

// Get label from corresponding github label
async function get_external_label(productId, externalLabelTitle, externalLabelBody, externalType) {
    // Get label from firestore
    // Returns array of documents or null
    const promise = await db.collection('products')
                            .doc(productId)
                            .collection('labels')
                            .where('list.' + externalLabelTitle, '==', externalLabelBody)
                            .limit(1)
                            .get()

    try{
      // Get first document (The array should never contain more than 1 document)
      let label = promise.docs[0]
      if(label) {
        label = label.data()
        return label
      }
      // Return null if it doesnt exist
      return null
    } catch(e) {
        // Error should only occur if null is returned from firebase and thus the label doesnt exist
        console.log(e)
        return null
    }                        
}

module.exports = {
    webhook: github_webhook
}
