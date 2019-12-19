const functions = require('firebase-functions');

const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the 'totalIssues' and 'finishedIssues' fields in sprints
// who the story belongs to
const updateSprints = async (change, context) => {
    // If the story didnt exist and the status is closed then increment 'finishedIssues'
    if(!change.before.exists && change.after.data().status.toLowerCase() === "closed") {
        db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(1)}, {merge: true})
    // If the story didnt exist and the status is open then do nothing
    } else if(!change.before.exists && change.after.data().status.toLowerCase() === "open") {
        //Do nothing
    // If the story got deleted and the status was open then do nothing
    } else if(!change.after.exists && change.before.data().status.toLowerCase() === "open") {
        //Do nothing
    // If the story got deleted and the status was closed then decrement 'finishedIssues'
    } else if(!change.after.exists && change.before.data().status.toLowerCase() === "closed") {
        db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(-1)}, {merge: true})
    // If the story was changed from closed to open then decrement 'finishedIssues'
    } else if(change.before.data().status.toLowerCase() === "closed" && change.after.data().status.toLowerCase() === "open") {
        db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(-1)}, {merge: true})
    // If the story was changed from open to closed then increment 'finishedIssues'
    } else if(change.before.data().status.toLowerCase() === "open" && change.after.data().status.toLowerCase() === "closed") {
        db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(1)}, {merge: true})
    }

    // If the story didnt exist and the sprint is set then:
    // 1. Add the issue to the sprint's issue collection
    // 2. Increment 'totalIssues'
    if(!change.before.exists && change.after.data().sprint !== null) {
        let batch = db.batch();

        let storyRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).collection('stories').doc(context.params.story)
        batch.set(storyRef, change.after.data());

        let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint)
        batch.update(sprintRef, {totalIssues: FieldValue.increment(1)}, {merge: true})

        return batch.commit().catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    //Nothing happens when the sprint field stays unchanged
    if(change.after.exists && change.before.exists && change.after.data().sprint === change.before.data().sprint) {
        return null
    }

    //totalIssues-- when a document is deleted or if the sprint field is set to null

    // If the issue is deleted or the sprint was changed from a value to null then
    // 1. delete the story from the sprints stories collection
    // 2. defrement totalIssues
    if(!change.after.exists || (change.after.data().sprint === null && change.before.data().sprint !== null)) {
        let storyRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.before.data().sprint).collection('stories').doc(context.params.story)
        let countRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.before.data().sprint)

        return db.runTransaction((transaction) => {
            return transaction.get(countRef).then((snapshot) => {
                if (!snapshot.exists) {
                    return "no sprint to update"
                }

                transaction.delete(storyRef)
                return transaction.update(countRef, {totalIssues: FieldValue.increment(-1)}, {merge: true})
            });
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
    }

    //totalIssues++ on new sprint. happens if story exists and has sprint as null, but gets assigned a sprint
    if(change.after.data().sprint !== null && change.before.data().sprint === null) {
        let batch = db.batch();

        let afterStoryRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint)
        batch.update(afterStoryRef, {totalIssues: FieldValue.increment(1)}, {merge: true})

        return batch.commit().catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    // If the sprint before wasnt null and the sprint after isnt null and the before and after sprint isnt then same then:
    // 1. Decrement 'totalIssues' on the before issue
    // 2. Increment 'totalIssues' on the after issue
    if(change.after.data().sprint !== null && change.before.data().sprint !== null && change.after.data().sprint !== change.before.data().sprint) {
        let batch = db.batch();

        let beforeStoryRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.before.data().sprint)
        batch.update(beforeStoryRef, {totalIssues: FieldValue.increment(-1)}, {merge: true})

        let afterStoryRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint)
        batch.update(afterStoryRef, {totalIssues: FieldValue.increment(1)}, {merge: true})

        return batch.commit().catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return null
}

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the 'totalEstimate' field in sprints
// who the story belongs to
const updateSprintEstimate = async (change, context) => {
    // Creation of story
    // Increment the 'totalEstimate' with the estimate of the new story
    if(!change.before.exists) {
        let sprint = change.after.data().sprint
        let estimate = change.after.data().estimate
        if(!sprint || !estimate) {
            return null
        }
        let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
        return sprintRef.update({totalEstimate: FieldValue.increment(estimate)}, {merge: true})
    }
    // Deletion of story
    // Decrement the 'totalEstimate' with the estimate of the deleted story
    if(!change.after.exists) {
        let sprint = change.before.data().sprint
        let estimate = change.before.data().estimate
        if(!sprint || !estimate) {
            return null
        }
        let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
        return sprintRef.update({totalEstimate: FieldValue.increment(-estimate)}, {merge: true})
    }
    // Sprint is removed from story
    // Remove estimate of story from sprint
    if(change.before.data().sprint && !change.after.data().sprint && change.before.data().estimate) {
        let sprint = change.after.data().sprint
        let estimate = change.before.data().estimate
        let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
        return sprintRef.update({totalEstimate: FieldValue.increment(-estimate)}, {merge: true})
    }
    // Sprint is added 
    // Add estimate of story to sprint
    if(!change.before.data().sprint && change.after.data().sprint && change.before.data().estimate) {
        let sprint = change.after.data().sprint
        let estimate = change.before.data().estimate
        let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
        return sprintRef.update({totalEstimate: FieldValue.increment(estimate)}, {merge: true})
    }
    // Sprint exists and is the same, but estimate changed
    // we must remove old estimate of story from the sprint and add new estimate of the story to the sprint
    if(change.before.data().sprint && change.after.data().sprint
        && change.before.data().sprint === change.after.data().sprint
        && change.before.data().estimate !== change.after.data().estimate)
    {
        let sprint = change.after.data().sprint
        let estimateBefore = change.before.data().estimate
        let estimateAfter = change.after.data().estimate
        let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
        if(!estimateBefore && estimateAfter) {
            return sprintRef.update({totalEstimate: FieldValue.increment(estimateAfter)}, {merge: true})
        }
        if(estimateBefore && !estimateAfter) {
            return sprintRef.update({totalEstimate: FieldValue.increment(-estimateBefore)}, {merge: true})
        }
        if(estimateBefore && estimateAfter) {
            let difference = estimateAfter - estimateBefore
            return sprintRef.update({totalEstimate: FieldValue.increment(difference)}, {merge: true})
        }
    }
    // default return
    return null
}

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the --STATS-- document.
/*const updateStoriesStats = async (change, context) => {
    // If the document is '--STATS--' then end as it doenst need to be updated
    if(context.params.story === "--STATS--") {
        return "Stats document doesnt need to be updated"
    }
    return null
}*/

module.exports = {
    updateSprints: updateSprints,
    updateSprintEstimate: updateSprintEstimate
    //updateStoriesStats: updateStoriesStats
}