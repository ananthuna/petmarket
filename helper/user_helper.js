var collection=require('../mongodb_conn/collections')
var db=require('../mongodb_conn/db_connection')
const bcrypt=require('bcrypt')
module.exports={

    doSignup:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.user_collection).insertOne(userData).then((data)=>{
                resolve(data)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user=await db.get().collection(collection.user_collection).findOne({email:userData.email})
            if(user){
               bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login filed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('filed')
                resolve({status:false})
            }
        })
    }
}