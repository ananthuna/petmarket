var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_body',{admin:true})
});

router.post('/admin_body',(req,res,next)=>{

  console.log('in router')

  res.render('admin/admin_body',{admin:true})
  //res.render('admin/admin_body',{admin:true})
})



module.exports = router;
