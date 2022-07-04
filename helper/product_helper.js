var collection = require('../mongodb_conn/collections')
var db = require('../mongodb_conn/db_connection')

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection(collection.pet_collection).insertOne(product).then((data) => {


            callback(data)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.pet_collection).find().toArray()
            resolve(products)
        })
    },


}