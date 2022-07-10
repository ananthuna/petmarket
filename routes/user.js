const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helper/product_helper')
var userHelper = require('../helper/user_helper')
const verifylogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  
  productHelper.getAllProducts().then((products) => {

    var admin=req.session.loggedIn

    res.render('user/user_body', { admin, products });
  })




});

router.get('/login', (req, res, next) => {
  
  
  if(req.session.loggedIn){
    res.redirect('/admin')
  }else{
    
    res.render('login/admin_login',{"error":req.session.err})
    req.session.err=false
  }
  
})

router.post('/login/admin_login', (req, res, next) => {

  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn=true
      req.session.user=response.user

      
      res.redirect('/admin')
    } else {
      req.session.err="Invalid username or password"
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

router.get('/cart',verifylogin,(req,res,next)=>{
  res.render('user/cart')
})



module.exports = router;
  