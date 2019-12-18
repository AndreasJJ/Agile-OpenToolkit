// Adds document to firestore
/* 
 * 'firebase' is the firestore object
 * 'path' is the path to the document
 * 'data' is the document data
 */
async function AddDocument(firebase, path, data) {
    return await firebase.db.collection(path).add(data)
}

export default AddDocument