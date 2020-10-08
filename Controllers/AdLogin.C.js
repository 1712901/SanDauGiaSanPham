const express=require('express');
var router=express.Router();



router.get('/admin',(req,res)=>{
    res.render('AdRender/AdLogin');
})
router.post('/admin',(req,res)=>{
    const email=req.body.email;
    const pw=req.body.password;
    console.log(email+"  "+ pw);
    res.redirect('/admin');
})

module.exports=router;




