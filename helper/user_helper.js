var collection = require('../mongodb_conn/collections')
var db = require('../mongodb_conn/db_connection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
const collections = require('../mongodb_conn/collections')
module.exports = {

    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collections.user_collection).insertOne(userData).then((data) => {
                resolve(data)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collections.user_collection).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login filed')
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('filed')
                resolve({ status: false })
            }
        })
    },
    addToCart: (ProId, userId) => {
        let prodObj = {
            item: ObjectId(ProId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.cart_collection).findOne({ user: ObjectId(userId) })

            if (userCart) {

                let peodExist = userCart.product.findIndex(Element => Element.item == ProId)

                if (peodExist >= 0) {
                    db.get().collection(collections.cart_collection)
                        .updateOne({ user: ObjectId(userId), 'product.item': ObjectId(ProId) },
                            {
                                $inc: { 'product.$.quantity': 1 }
                            }).then(() => {
                                resolve()
                            })
                } else {

                    db.get().collection(collections.cart_collection)
                        .updateOne({ user: ObjectId(userId) },

                            {
                                $push: { product: prodObj }
                            }
                        ).then((response) => {
                            resolve()
                        })
                }
            } else {
                let cartObj = {
                    user: ObjectId(userId),
                    product: [prodObj]
                }
                db.get().collection(collections.cart_collection).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {

            let cartItems = await db.get().collection(collections.cart_collection).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.pet_collection,
                        localField: 'item',
                        foreignField: '_id',
                        as: "product"
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] },


                    }
                }


            ]).toArray()


           
           resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = null
            let userCart = await db.get().collection(collections.cart_collection).findOne({ user: ObjectId(userId) })
            if (userCart) {
                count = userCart.product.length
            }
            resolve(count)
        })
    },
    changeProductQuantity: (details) => {
        count = parseInt(details.count)
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.cart_collection)
                .updateOne({ _id: ObjectId(details.cart), 'product.item': ObjectId(details.product) },
                    {
                        $inc: { 'product.$.quantity': count }
                    })

            let productCount = await db.get().collection(collections.cart_collection).aggregate([
                {
                    $match: { _id: ObjectId(details.cart) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.pet_collection,
                        localField: 'item',
                        foreignField: '_id',
                        as: "product"
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] },


                    }
                }, {
                    $match: { item: ObjectId(details.product) }
                }



            ]).toArray()

            resolve(productCount)



        })
    },
    removeCartItem: (cartId, proId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.cart_collection)
                .updateOne(
                    { _id: ObjectId(cartId) },
                    {
                        $pull:
                        {
                            product:
                                { item: ObjectId(proId) }
                        }
                    })
            resolve()
        })
    },
    total:(userId)=>{
        return new Promise(async (resolve, reject) => {

            let cartTotal = await db.get().collection(collections.cart_collection).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.pet_collection,
                        localField: 'item',
                        foreignField: '_id',
                        as: "product"
                    }
                },
                {
                    $project: {
                        
                        quantity: 1,
                        price: {$toInt:{ $arrayElemAt: ['$product.price', 0] }},


                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$price']}}
                    }
                }


            ]).toArray()


           
           resolve(cartTotal[0])
        })
    }
}