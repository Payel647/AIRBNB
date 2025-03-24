const express = require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    try{let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","Welcome to Wanderlust!");
        res.redirect("/listings");
    });
} catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
   req.flash("Success","Welcome back to WanderLust!");
   let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
})
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("Success","you are Successfully logged out!");
        res.redirect("/listings");
    })
})
module.exports=router;