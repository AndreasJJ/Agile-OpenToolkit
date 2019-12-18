// Adds document to firestore
/* 
 * 'firebase' is the firestore object
 * 'path' is the path to the collection
 * 'wheres' is an array of arrays => 
 *      [["filedName", 'operator', 'query'], ["capital", "==", true], ["state", "==", "CA"]]
 * 'orderBys' is an array of arrays =>
 *      [['fieldName', 'order'], ["population", "desc"], ["population", "asc"]]
 * 'startAt' the index to start at
 * 'startAfter' the index to start after
 * 'endAt' the index to end at
 * 'endBefore' the index to end before
 * 'limit' limit to x number of documents to retrieve
 */
async function GetDocuments(firebase, path, wheres, orderBys, startAt, startAfter, endAt, endBefore, limit) {
    let ref = firebase.db.collection(path)
    
    // Add the wheres to the ref
    if(wheres) {
        for(let where of wheres) {
            ref = ref.where(...where)
        }
    }
    
    // Add the orderBys to the ref
    if(orderBys) {
        for(let orderBy of orderBys) {
            ref = ref.orderBy(...orderBy)
        }
    }
    
    // Add starter or ender to ref
    if(startAt) {
        ref = ref.startAt(...startAt)
    } else if (startAfter) {
        ref = ref.startAfter(...startAfter)
    } else if (endAt) {
        ref = ref.endAt(...endAt)
    } else if (endBefore) {
        ref = ref.endBefore(...endBefore)
    }

    // Add limit
    if(limit) {
        ref = ref.limit(limit)
    }

    // Get documents and return them (with the id added to the object)
    let snapshot = await ref.get()
    let documents = null
    if(snapshot) {
        documents = snapshot.docs.map((doc) => {
            let object = doc.data()
            object.id = doc.id
            return object
        })
    }
    
    return documents
}

export default GetDocuments