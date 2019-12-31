const admin = require('../admin.js');
const db = admin.db;

// Listen for deletes in all doucments in the 'products/{sprint}/sprints' collection and deletes the sprint from all stories who has
// their story set to it
const updateStoriesOnSprintDelete = async (change, context) => {
    // Ref to stories where the sprint field is equal to the sprint id from the deleted sprint
    let storiesRef = db.collection('products').doc(context.params.product).collection('stories').where('sprint', '==', context.params.sprint)
    // Run transaction
    return db.runTransaction((transaction) => {
        // Read storiesRef
        return transaction.get(storiesRef).then((snapshot) => {
            // If no stories is connected to the sprint then end transaction
            if (!snapshot.docs) {
                return "no stories to update sprint"
            }

            // For each story connected to the sprint, set the sprint equal to null
            return snapshot.docs.forEach((doc) => {
                let storyRef = db.collection('products').doc(context.params.product).collection('stories').doc(doc.id)
                transaction.update(storyRef, {sprint: null})
            })
        });
    }).catch((error) => {
        console.log("Transaction failed: ", error);
    });
}

const sprintBoardListCreation = async (change, context) => {
    let batch = db.batch();
    let list1 = db.collection('products').doc(context.params.product).collection('sprints').doc(context.params.sprint).collection("lists").doc()
    let list2 = db.collection('products').doc(context.params.product).collection('sprints').doc(context.params.sprint).collection("lists").doc()
    
    let list1Data = {
        title: "OPEN",
        stories: []
    }

    let list2Data = {
        title: "CLOSED",
        stories: []
    }

    batch.set(list1, list1Data)
    batch.set(list2, list2Data)

    return batch.commit().catch((error) => {
        console.error("Error adding lists: ", error);
    });
    
}

module.exports = {
    updateStoriesOnSprintDelete: updateStoriesOnSprintDelete,
    sprintBoardListCreation: sprintBoardListCreation
}