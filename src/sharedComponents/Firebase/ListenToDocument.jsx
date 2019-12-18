// Gets the inital document from path and then listens to changes to the document
// and runs onSnapshot (which is supplied the document snapshot object as an arugment) if it does
/* 
 * 'firebase' is the firestore object
 * 'onSnapshot' function that runs on change, it gets supplied the document snapshot object
 * 'path' is the path to the document
 */
async function ListenToDocument(firebase, onSnapshot, path) {
    let ref = firebase.db.doc(path)

    let productListener = await ref.onSnapshot(onSnapshot)
    return productListener
}

export default ListenToDocument