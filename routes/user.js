var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

 
  res.render('user/user_body', {admin:false });
});

router.get('/login',(req,res,next)=>{
  res.render('login/admin_login',{admin:false})
})

router.post('/login',(req,res,next)=>{
  res.render('login/admin_login',{admin:false})
})



module.exports = router;
