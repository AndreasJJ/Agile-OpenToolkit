async function GetDocument(firebase, path) {
    let snapshot = await firebase.db.doc(path).get()
    let document = snapshot.data()
    if(document) {
        document.id = snapshot.id
    }
    return document
}

export default GetDocument