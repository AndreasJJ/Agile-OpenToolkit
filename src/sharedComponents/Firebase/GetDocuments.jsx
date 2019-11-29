async function GetDocuments(firebase, path, wheres, orderBys, startAt, startAfter, endAt, endBefore, limit, limitToLast) {
    let ref = firebase.db.collection(path)
    
    if(wheres) {
        for(let where of wheres) {
            ref = ref.where(...where)
        }
    }
    
    if(orderBys) {
        for(let orderBy of orderBys) {
            ref = ref.orderBy(...orderBy)
        }
    }
    
    if(startAt) {
        ref = ref.startAt(...startAt)
    } else if (startAfter) {
        ref = ref.startAfter(...startAfter)
    } else if (endAt) {
        ref = ref.endAt(...endAt)
    } else if (endBefore) {
        ref = ref.endBefore(...endBefore)
    }

    if(limit) {
        ref = ref.limit(limit)
    } else if (limitToLast) {
        ref = ref.limitToLast(...limitToLast)
    }

    let snapshot = await ref.get()
    let documents = snapshot.docs.map((doc) => {
        let object = doc.data()
        object.id = doc.id
        return object
    })
    
    return documents
}

export default GetDocuments