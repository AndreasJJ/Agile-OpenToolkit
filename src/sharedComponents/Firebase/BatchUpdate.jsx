// Does a batch write to firestore
/* 
 * 'firebase' is the firestore object
 * 'pathAndData' is an array of arrays where the inner arrays has two elements where
 *      the first element is the path and the second element is the data
 *      Example [['path1', {dataObject1}], ['path2', {dataObject2}]]
 * 'success' is the function that will run if the batch writes succeeds
 * 'failure' is the function that will run if the batch writes fails
 */
async function BatchUpdate(firebase, pathAndData, success, failure) {
    const batch = firebase.db.batch()

    for(let element of pathAndData) {
        const ref = firebase.db.doc(element[0])
        batch.update(ref, element[1])
    }
    
    batch.commit().then(success).catch(failure);
}

export default BatchUpdate