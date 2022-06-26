var express = require('express');
var router = express.Router();
var productHelper=require('../helper/product_helper')
const mongoClient = require('mongodb').MongoClient
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_body',{admin:true})
});

router.post('/admin_body',(req,res,next)=>{

  productHelper.addProduct(req.body,(id)=>{

    console.log(id)
    // let image=req.files.Image
    // image.mv('./public/images/'+id+'.jpg',(err,done)=>{
    //   if(err){
    //     console.log('error'+err)
    //   }else{
    //     console.log('image added')
    //   }
    // })

  })  

  
  res.render('admin/admin_body',{admin:true})
})



module.exports = router;
