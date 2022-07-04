const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helper/product_helper')
var userHelper = require('../helper/user_helper')

/* GET home page. */
router.get('/', function (req, res, next) {
  
  productHelper.getAllProducts().then((products) => {


    res.render('user/user_body', { admin:false, products });
  })




});

router.get('/login', (req, res, next) => {
  res.render('login/admin_login')
})

router.post('/login/admin_login', (req, res, next) => {

  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn=true
      req.session.user=response.user

      
      res.redirect('/admin')
    } else {
      res.redirect('/login')
    }
  })

})

router.get('/login/admin_signup', (req, res, next) => {

  res.render('login/admin_signup')

})

router.post('/login/admin_signup', (req, res, next) => {

  userHelper.doSignup(req.body).then((data) => {

    res.render('login/admin_login')
  })
})

router.get('/logout',(req,res,next)=>{
  req.session.destroy()
  res.redirect('/')
})


module.exports = router;
