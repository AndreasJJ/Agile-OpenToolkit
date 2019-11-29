async function BatchWrite(firebase, pathAndData, success, failure) {
    const batch = firebase.db.batch()

    for(let element of pathAndData) {
        const ref = firebase.db.doc(element[0])
        batch.set(ref, element[1])
    }
    
    batch.commit().then(success).catch(failure);
}

export default BatchWrite