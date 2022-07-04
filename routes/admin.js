
var express = require('express');


var router = express.Router();
var productHelper=require('../helper/product_helper')

const mongoClient = require('mongodb').MongoClient
/* GET users listing. */
router.get('/', function(req, res, next) {

  
  productHelper.getAllProducts().then((products)=>{
    
    
    res.render('admin/admin_body',{admin:true,products})
  })
  
});

router.post('/admin_body',(req,res,next)=>{

  productHelper.addProduct(req.body,(id)=>{

    var _id=id.insertedId.toString()
     let image=req.files.Image
     image.mv('./public/image/'+_id+'.jpg',(err,done)=>{
       if(err){
         console.log('error'+err)
       }else{
        productHelper.getAllProducts().then((products)=>{
    
    
          res.render('admin/admin_body',{admin:true,products})
        })
         console.log('image added')
       }
     })

  })  
  
})



module.exports = router;
