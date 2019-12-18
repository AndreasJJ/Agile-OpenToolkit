// Gets inital documents from path and then listens to changes 
// and runs onSnapshot (which is supplied the snapshot object as an arugment) if it does
/* 
 * 'firebase' is the firestore object
 * 'onSnapshot' function that runs on change, it gets supplied the snapshot object
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
async function ListenToDocuments(firebase, onSnapshot, path, wheres, orderBys, startAt, startAfter, endAt, endBefore, limit) {
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

    // Get and listen
    let productListener = await ref.onSnapshot(onSnapshot)
    return productListener
}

export default ListenToDocuments