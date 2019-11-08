export default async function getCollection(firebase, path, wheres, orderBys, limits) {
    
    let query = await firebase.db.collection(path)

    if(wheres) {
        for(let where of wheres) {
            query = query.where(...where)
        } 
    }
    
    if(orderBys) {
        for(let orderBy of orderBys) {
            query = query.orderBy(orderBy)
        }
    }
    
    if(limits) {
        for(let limit of limits) {
            query = query.limit(limit)
        } 
    }
    let snapshot = await query.get()
    let documents = snapshot.docs

    return documents
}
