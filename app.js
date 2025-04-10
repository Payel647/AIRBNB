if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const conet=process.env.ds;
const ejsMate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require("connect-mongo")
const flash=require("connect-flash");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(conet);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const store = MongoStore.create({
  mongoUrl:conet,
  crypto:{
      secret: process.env.SECRET,
  },
  touchAfter:24 * 3600,
})
store.on("error", ()=>{
  console.log("Error in Mongo Session " , err)
})
store.on("error", ()=>{
  console.log("Error in Mongo Session " , err)
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie :{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
  },
}
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.Success=req.flash("Success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})
// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"payel@email.com",
//     username:"student"
//   });
//   let registeredUser=await User.register(fakeUser,"payel");
//   res.send(registeredUser);
// })
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
     next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
  let { statusCode=500,message="Something went wrong!" }=err;
  //res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err});
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});