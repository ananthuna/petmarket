const { ObjectId } = require('mongodb')
const { response } = require('../app')
const collections = require('../mongodb_conn/collections')
var collection = require('../mongodb_conn/collections')
var db = require('../mongodb_conn/db_connection')

module.exports = {

    addProduct: (product, user, callback) => {

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
    getAddedProducts: (user) => {
        return new Promise(async (resolve, reject) => {

            let products = await db.get().collection(collection.pet_collection).find().toArray()
            resolve(products)
        })
    },
    deleteProducts: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.pet_collection).deleteOne({ _id: ObjectId(productId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.pet_collection).findOne({ _id: ObjectId(id) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (id, details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.pet_collection).updateOne(
                { _id: ObjectId(id) }, {
                    $set:{
                        name:details.name,
                        price:details.price,
                        bname:details.bname
                    }
            }).then((response)=>{
                resolve()
            })
        })
    }



}