
var express = require('express');


var router = express.Router();
var productHelper = require('../helper/product_helper')


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


      res.render('/user', { user,admin, products });
    })
  }



});

router.post('/admin_body', (req, res, next) => {
  
  let admin = req.session.loggedIn
  let user=req.session.user
  productHelper.addProduct(req.body, (id) => {

    var _id = id.insertedId.toString()
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





module.exports = router;
