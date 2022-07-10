
var express = require('express');
const { response } = require('../app');


var router = express.Router();
var productHelper = require('../helper/product_helper');
const { db_connect } = require('../mongodb_conn/db_connection');


/* GET users listing. */
router.get('/', function (req, res, next) {
  let admin=req.session.loggedIn
  let user=req.session.user
  if (admin) {
    productHelper.getAllProducts().then((products) => {


      res.render('admin/admin_body', { user,admin, products })
    })
  } else {

    productHelper.getAllProducts().then((products) => {
      //res.send('goto user page')

      productHelper.getAllProducts().then((products) => {

        var admin=req.session.loggedIn
    
        res.render('user/user_body', { admin, products });
      })
    })
  }



});


router.post('/admin_body', (req, res, next) => {
  
  let admin = req.session.loggedIn
  let user=req.session.user
  productHelper.addProduct(req.body,user, (data) => {

    var _id = data.insertedId.toString()
    let image = req.files.Image
    image.mv('./public/image/' + _id + '.jpg', (err, done) => {
      if (err) {
        console.log('error' + err)
      } else {
        productHelper.getAllProducts().then((products) => {


          res.render('admin/admin_body', {user, admin, products })
        })
        console.log('image added')
      }
    })

  })

})

router.get('/product-list',(req,res)=>{
  let admin=req.session.loggedIn
  let user=req.session.user
  
  if (admin) {
    productHelper.getAddedProducts(user).then((products) => {


      res.render('admin/product-list', { user,admin, products })
    })
  } 
  
})

router.get('/delete-product',(req,res)=>{
    let productId=req.query.id
    productHelper.deleteProducts(productId).then((data)=>{
      res.redirect('admin/product-list')
    })

})
router.get('/edit-product/',async(req,res)=>{
  let admin=req.session.loggedIn
  let id=req.query.id
  console.log(id)
  let product=await productHelper.getProductDetails(id)
  console.log(product)
  res.render('admin/edit-product',{admin,product,id})
})
router.post('/edit-product/',(req,res)=>{
  var id=req.query.id
  
  productHelper.updateProduct(id,req.body).then(()=>{
    res.redirect('product-list')
    if(req.files.Image){
      let image = req.files.Image
    image.mv('./public/image/' +id + '.jpg')
    }
  })
})





module.exports = router;
