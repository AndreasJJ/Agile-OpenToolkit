async function AddDocument(firebase, path, data) {
    return await firebase.db.collection(path).add(data)
}

export default AddDocument