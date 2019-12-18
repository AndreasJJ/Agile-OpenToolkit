// Deletes document
/* 
 * 'firebase' is the firestore object
 * 'path' is the path to the document (including document name)
 */
async function DeleteDocument(firebase, path) {
    return await firebase.db.doc(path).delete()
}

export default DeleteDocument