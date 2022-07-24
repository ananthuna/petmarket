
var express = require('express');
const { response } = require('../app');


var router = express.Router();
var productHelper = require('../helper/product_helper');
const { db_connect } = require('../mongodb_conn/db_connection');
var userHelper = require('../helper/user_helper');
const { Collection } = require('mongodb');
const collections = require('../mongodb_conn/collections');


/* GET users listing. */
router.get('/',async function (req, res) {
  let admin = req.session.loggedIn
  let user = req.session.user
  if (admin) {
    let cartCount=await userHelper.getCartCount(user._id)
    productHelper.getAllProducts().then((products) => {


      res.render('admin/admin_body', { user, admin, products,cartCount })
    })
  } else {

    productHelper.getAllProducts().then((products) => {
      //res.send('goto user page')

      productHelper.getAllProducts().then((products) => {

        var admin = req.session.loggedIn

        res.render('user/user_body', { admin, products });
      })
    })
  }



});


router.post('/admin_body', (req, res, next) => {

  let admin = req.session.loggedIn
  let user = req.session.user
  productHelper.addProduct(req.body, user, (data) => {

    var _id = data.insertedId.toString()
    let image = req.files.Image
    image.mv('./public/image/' + _id + '.jpg', (err, done) => {
      if (err) {
        console.log('error' + err)
      } else {
        productHelper.getAllProducts().then((products) => {
          res.render('admin/admin_body', { user, admin, products })
        })
        console.log('image added')
      }
    })

  })

})

router.get('/product-list', async(req, res) => {
  let admin = req.session.loggedIn
  let user = req.session.user

  if (admin) {
    let cartCount=await userHelper.getCartCount(user._id)
    productHelper.getAddedProducts(user).then((products) => {


      res.render('admin/product-list', { user, admin, products,cartCount })
    })
  }

})

router.get('/delete-product', (req, res) => {
  let productId = req.query.id
  productHelper.deleteProducts(productId).then((data) => {
    res.redirect('admin/product-list')
  })

})

router.get('/edit-product/', async (req, res) => {
  let admin = req.session.loggedIn
  let user = req.session.user
  let id = req.query.id
  let cartCount=await userHelper.getCartCount(user._id)
  let product = await productHelper.getProductDetails(id)
 
  res.render('admin/edit-product', { user, admin, product, id,cartCount })
})

router.post('/edit-product/', (req, res) => {
  var id = req.query.id

  productHelper.updateProduct(id, req.body).then(() => {
    res.redirect('product-list')
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/image/' + id + '.jpg')
    }
  })
})

router.get('/cart', async (req, res) => {
  var admin = req.session.loggedIn
  var user = req.session.user
  let products = await userHelper.getCartProducts(user._id)
  let cartCount=await userHelper.getCartCount(user._id)
  let cartTotal=await userHelper.total(user._id)
  console.log(cartCount)
  res.render('admin/cart', { user, admin, products,cartCount,cartTotal })
  
})

router.get('/add-to-cart/:id', (req, res) => {

 
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {

    res.json({status:true})

  })
})
router.post('/change-product-quantity/',async(req,res,next)=>{
  
  await userHelper.changeProductQuantity(req.body).then(async(count)=>{
    let total=await userHelper.total(req.session.user._id)
    
    res.json({quantity:count[0].quantity,item:count[0].item,total:total.total})
  })
})

router.get('/remove-item', async (req, res) => {

 let cartId=req.query.id
 let proId=req.query.proId
  
  userHelper.removeCartItem(cartId,proId).then(()=>{
    
    res.redirect('cart')
  })
  
  
})

router.get('/place-order',async(req,res)=>{
  var admin = req.session.loggedIn
  var user = req.session.user
  let cartCount=await userHelper.getCartCount(user._id)
  let cartTotal=await userHelper.total(user._id)
  let products = await userHelper.getCartProducts(user._id)
  
  res.render('admin/place-order', { user, admin,cartCount,cartTotal:cartTotal.total,products:products})
 
})

router.post('/add-address/',async(req,res)=>{
  
 res.json({added:req.body})
 
})

router.post('/order-summary/',(req,res)=>{
 
  res.json({data:true})

})
module.exports = router;
