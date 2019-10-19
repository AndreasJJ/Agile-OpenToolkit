const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

// Listen for changes in all documents in the 'products/members' collection and add it to the users product list
exports.addProductToUserProductList = functions.firestore
    .document('products/{product}/members/{member}')
    .onWrite((change, context) => {
    	if(context.params.member === "members") {
    		return "Information document doesnt need to be updated"
    	}

		if(!change.after.exists) {
			let batch = db.batch();

			let userRef = db.collection("users").doc(context.params.member).collection('products').doc(context.params.product)
			batch.delete(userRef)

			let userInMemberListRef = db.collection('products').doc(context.params.product).collection('members').doc('members')
			batch.update(userInMemberListRef, {list: FieldValue.arrayRemove(context.params.member)}, {merge: true})

			return batch.commit().catch((error) => {
		    	console.error("Error removing document: ", error);
			});
		}

	    let productRef = db.collection('products').doc(context.params.product)

		return db.runTransaction((transaction) => {
		    return transaction.get(productRef).then((doc) => {
		        if (!doc.exists) {
		            return "No product with that id"
		        }

              	let userProductRef = db.collection('users').doc(context.params.member).collection('products').doc(context.params.product)
		      	transaction.set(userProductRef, {
		      		name: doc.data().name,
		      		description: doc.data().description,
		      		owner: doc.data().owner
		      	})

		      	let membersListRef = db.collection('products').doc(context.params.product).collection('members').doc('members')
		      	transaction.update((membersListRef), {
		      		list: FieldValue.arrayUnion({[context.params.member]:{
		      			firstname: change.after.get('firstname'),
		      			lastname: change.after.get('lastname'),
		      			email: change.after.get('email'),
		      			profilePicture: change.after.get('profilePicture') ? change.after.get('profilePicture') : null
		      		}})
		      	}, {merge: true})
		      	return "Success"
		    });
		}).catch((error) => {
		    console.log("Transaction failed: ", error);
		});

    });

exports.updateProductInfo = functions.firestore
    .document('products/{product}')
    .onUpdate((change, context) => {
    	const newDoc = change.after.data();

    	let productRef = db.collection('products').doc(context.params.product).collection('members')

		return db.runTransaction((transaction) => {
		    return transaction.get(productRef).then((snapshot) => {
		        if (!snapshot.exists) {
		            return "no members to update"
		        }

              	return snapshot.forEach((member) => {
              		let userProductRef = db.collection('users').doc(member.id).collection('products').doc(context.params.product)

              		transaction.update(userProductRef, {
    					name: newDoc.name,
    					description: newDoc.description,
    					owner: newDoc.owner
    				}, {merge: true})
              	})
		    });
		}).catch((error) => {
		    console.log("Transaction failed: ", error);
		});
    });

exports.updateStoriesOnSprintDelete = functions.firestore
    .document('products/{product}/sprints/{sprint}')
    .onDelete((change, context) => {
        let storiesRef = db.collection('products').doc(context.params.product).collection('stories').where('sprint', '==', context.params.sprint)
        return db.runTransaction((transaction) => {
            return transaction.get(storiesRef).then((snapshot) => {
                if (!snapshot.docs) {
                    return "no stories to update sprint"
                }

                return snapshot.docs.forEach((doc) => {
                    let storyRef = db.collection('products').doc(context.params.product).collection('stories').doc(doc.id)
                    transaction.update(storyRef, {sprint: null})
                })
            });
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
    });

exports.updateSprints = functions.firestore
	.document('products/{product}/stories/{story}')
    .onWrite((change, context) => {
    	/* Not possible with firestore.........

    	let authorRef = db.collection("users").doc(context.auth.uid)
    	let productRef = db.collection("products").doc(context.params.product).collection("stories").doc(context.params.story)
    	db.runTransaction(function(transaction) {
		    return transaction.get(authorRef).then(function(snapshot) {
		        if (!snapshot.exists) {
		            return
		        }

              	return transaction.update(productRef, {
		    		lastUpdateTimestamp: new Date(),
		    		lastEditer: {
		    			firstname: snapshot.firstname,
		    			lastname: snapshot.lastname,
		    			uid: snapshot.uid
		    		}
		    	})
		    });
		}).catch(function(error) {
		    console.log("Transaction failed: ", error);
		});
		
		*/
		if(!change.before.exists && change.after.data().status.toLowerCase() === "closed") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(1)}, {merge: true})
		} else if(!change.before.exists && change.after.data().status.toLowerCase() === "open") {
			//Do nothing
		} else if(!change.after.exists && change.before.data().status.toLowerCase() === "open") {
			//Do nothing
		} else if(!change.after.exists && change.before.data().status.toLowerCase() === "closed") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(-1)}, {merge: true})
		} else if(change.before.data().status.toLowerCase() === "closed" && change.after.data().status.toLowerCase() === "open") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(-1)}, {merge: true})
		} else if(change.before.data().status.toLowerCase() === "open" && change.after.data().status.toLowerCase() === "closed") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(1)}, {merge: true})
		}

    	//totalIssues++ when a story is created
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

    	//totalIssues++ on new sprint and totalIssues-- on old sprint when changing sprint on a story from one sprint to another
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
    });

exports.updateSprintEstimate = functions.firestore
    .document('products/{product}/stories/{story}')
    .onWrite((change, context) => {
    	// Creation of document
    	if(!change.before.exists) {
    		let sprint = change.after.data().sprint
    		let estimate = change.after.data().estimate
    		if(!sprint || !estimate) {
    			return null
    		}
    		let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
    		return sprintRef.update({totalEstimate: FieldValue.increment(estimate)}, {merge: true})
    	}
    	// Deletion of document
    	if(!change.after.exists) {
			let sprint = change.before.data().sprint
    		let estimate = change.before.data().estimate
    		if(!sprint || !estimate) {
    			return null
    		}
    		let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
    		return sprintRef.update({totalEstimate: FieldValue.increment(-estimate)}, {merge: true})
    	}
    	// Sprint is removed => we must remove estimate from sprint
    	if(change.before.data().sprint && !change.after.data().sprint && change.before.data().estimate) {
    		let sprint = change.after.data().sprint
    		let estimate = change.before.data().estimate
    		let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
    		return sprintRef.update({totalEstimate: FieldValue.increment(-estimate)}, {merge: true})
    	}
    	// Sprint is added => we need to add estimate from sprint
    	if(!change.before.data().sprint && change.after.data().sprint && change.before.data().estimate) {
    		let sprint = change.after.data().sprint
    		let estimate = change.before.data().estimate
    		let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(sprint)
    		return sprintRef.update({totalEstimate: FieldValue.increment(estimate)}, {merge: true})
    	}
    	// Sprint exists and is the same, but estimate changed => we must remove
    	// old estimate and add new estimate
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
   	});

// Listen to story writing to update the --STATS-- document
exports.updateStoriesStats = functions.firestore
    .document('products/{product}/stories/{story}')
    .onWrite((change, context) => {
    	if(context.params.story === "--STATS--") {
    		return "Stats document doesnt need to be updated"
    	}
    	// Creation of document
    	// Count++ in --STATS--
    	if(!change.before.exists) {
    		let statsRef = db.collection('products').doc(context.params.product).collection('stories').doc("--STATS--")
    		return statsRef.update({count: FieldValue.increment(1)}, {merge: true})
    	}
    	// Deletion of document
    	// Count-- in --STATS--
    	if(!change.after.exists) {
			let statsRef = db.collection('products').doc(context.params.product).collection('stories').doc("--STATS--")
    		return statsRef.update({count: FieldValue.increment(-1)}, {merge: true})
    	}
    	return null
   	});