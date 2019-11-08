export default async function getDocument(firebase, path, productId, wheres, orderBys, limits) {
    let query = await firebase.db.doc(path)

    if(wheres) {
        for(let where of wheres) {
            query.where(...where)
        } 
    }
    
    if(orderBys) {
        for(let orderBy of orderBys) {
            query.orderBy(orderBy)
        }
    }
    
    if(limits) {
        for(let limit of limits) {
            query.limit(limit)
        } 
    }

    let snapshot = await query.get()
    let data = snapshot.data()

    return data
}