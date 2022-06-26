const mongoClient = require('mongodb').MongoClient
var state={
    db:null
}
module.exports.db_connect=function(done){
    const url='mongodb+srv://petmarket:NufRTfohpV6UMWAD@cluster0.mvprdoh.mongodb.net/?retryWrites=true&w=majority'
    const dbname='petmarket'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
       
        
})
done()

}

module.exports.get=()=>{
    return state.db
}