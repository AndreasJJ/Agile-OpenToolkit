const admin = require('../admin.js');
const db = admin.db;
const FieldValue = admin.FieldValue;

const updateSprintIssueData = async(change, context) => {
    // Delete issue from sprint stories collection and remove it from sprintboard list
    // if the story is deleted or the sprint in the story is changed
    if(!change.after.exists || !change.after.data().sprint) {
        return db.runTransaction((transaction) => {
            // Ref to list that contains the story
            let listsRef = db.collection('products')
                             .doc(context.params.product)
                             .collection('sprints')
                             .doc(change.before.data().sprint)
                             .collection('lists')
                             .where('stories', 'array-contains', context.params.story)
            
            // Ref to the story copy inside the sprint stories collection
            let oldStoryRef = db.collection('products')
                                .doc(context.params.product)
                                .collection('sprints')
                                .doc(change.before.data().sprint)
                                .collection('stories')
                                .doc(context.params.story)

            // Transaction to get the lists that contain the story, remove it from the list and delete the story copy
            return transaction.get(listsRef).then((snapshot) => {
                // If a list contain the story, remove the story from it.
                if (snapshot.docs && snapshot.docs.length > 0) {
                    for(let doc of snapshot.docs) {
                        transaction.update(doc.ref , {stories: FieldValue.arrayRemove(context.params.story)}, {merge: true})
                    }
                }

                // Delete the story copy
                return transaction.delete(oldStoryRef)
            });
        }).catch((error) => {
            // Log and return error
            console.log("Transaction failed: ", error);
            return error
        });
    }

    // If the story is updated (not deleted or sprint removed) then update the story copy in the sprint
    // stories collection and if the story isnt in a sprintboard list then add it to the correct list
    return db.runTransaction((transaction) => {
        // Ref to the list that corresponds to its status
        let statusListsRef = db.collection('products')
                               .doc(context.params.product)
                               .collection('sprints')
                               .doc(change.after.data().sprint)
                               .collection('lists')
                               .where('title', '==', change.after.data().status.toUpperCase())
        
        // Ref to the list that the story is in
        let storyInListRef = db.collection('products')
                               .doc(context.params.product)
                               .collection('sprints')
                               .doc(change.after.data().sprint)
                               .collection('lists')
                               .where('stories', 'array-contains', context.params.story)
        
        // Ref to the story copy that is in the sprint collection
        let storyDataInSprintRef = db.collection('products')
                                     .doc(context.params.product)
                                     .collection('sprints')
                                     .doc(change.after.data().sprint)
                                     .collection('stories')
                                     .doc(context.params.story)

        // Get both the lists and update the correct list and update the sprint copy data
        return Promise.all([transaction.get(statusListsRef), transaction.get(storyInListRef)]).then((snapshots) => {
            // Status list snapshot
            let snapshot1 = snapshots[0]
            // The list the story is in snapshot
            let snapshot2 = snapshots[1]

            // If the story isnt in a list
            if (!snapshot2.docs || (snapshot2.docs && !(snapshot2.docs.length > 0))) {
                // If the status list exists
                if (snapshot1.docs && (snapshot1.docs.length > 0)) {
                    // Add the story to the status list
                    transaction.update(snapshot1.docs[0].ref, {
                        stories: FieldValue.arrayUnion(context.params.story)
                    })
                }
            }

            // Update the story copy
            return transaction.set(storyDataInSprintRef, change.after.data())
        })
    }).catch((error) => {
        // Log and return error
        console.log("Transaction failed: ", error);
        return error
    });
}

// Listen for changes in all doucments in the 'products/{story}/stories' collection and updates the 'totalIssues' and 'finishedIssues' fields in sprints
// who the story belongs to
const updateSprintIssueCounters = async (change, context) => {
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
    // 2. decrement totalIssues
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

module.exports = {
    updateSprintIssueData: updateSprintIssueData,
    updateSprintIssueCounters: updateSprintIssueCounters,
    updateSprintEstimate: updateSprintEstimate
}