// Gets document from database
/* 
 * 'firebase' is the firestore object
 * 'path' is the path to the document (including filename)
 */
async function GetDocument(firebase, path) {
    let snapshot = await firebase.db.doc(path).get()
    let document = snapshot.data()
    if(document) {
        document.id = snapshot.id
    }
    return document
}

export default GetDocument