// Updates document
/* 
 * 'firebase' is the firestore object
 * 'path' is the path to the document
 * 'data' is the document data
 * 'success' is the function that will run if the batch writes succeeds
 * 'failure' is the function that will run if the batch writes fails
 */
async function UpdateDocument(firebase, path, data, success, failure) {
    return await firebase.db
                         .doc(path)
                         .update(data)
                         .then(success)
                         .catch(failure)
}

export default UpdateDocument