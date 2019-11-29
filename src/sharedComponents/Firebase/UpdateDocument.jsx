async function UpdateDocument(firebase, path, data, success, failure) {
    return await firebase.db
                         .doc(path)
                         .update(data)
                         .then(success)
                         .catch(failure)
}

export default UpdateDocument