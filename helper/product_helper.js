const { ObjectId } = require('mongodb')
var db=require('../mongodb_conn/db_connection')

module.exports={
    addProduct:(product,callback)=>{
        db.get().collection('pet').insertOne(product).then((data)=>{
            console.log(product._id)
            var obj=product._id
            console.log(obj)
           console.log(Object.values(obj))
            
            callback(data)
        })
    }
}