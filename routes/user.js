var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const product=[{
    name:"Pegion",
    price:"5000",
    Qualities:"Pigeons are gentle, plump, small-billed birds with a skin saddle (cere) between the bill and forehea",
    image:"https://www.birdnote.org/sites/default/files/rock-pigeon-800-fyn-kynd-cc.jpg"
  }]
  res.render('index', {product,admin:false });
});

router.get('/login',(req,res,next)=>{
  res.render('login/admin_login',{admin:false})
})



module.exports = router;
