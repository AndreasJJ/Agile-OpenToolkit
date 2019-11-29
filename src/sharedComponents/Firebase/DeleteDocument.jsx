async function DeleteDocument(firebase, path) {
    return await firebase.db.doc(path).delete()
}

export default DeleteDocument