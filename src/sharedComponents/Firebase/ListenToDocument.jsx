async function ListenToDocument(firebase, onSnapshot, path) {
    let ref = firebase.db.doc(path)

    let productListener = await ref.onSnapshot(onSnapshot)
    return productListener
}

export default ListenToDocument