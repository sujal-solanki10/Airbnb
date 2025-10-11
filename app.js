if(process.env.NODE_ENV != "produciton"){
  require('dotenv').config();
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const Listing = require("./models/listing.js"); 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
// const {listingSchema} = require("./schema.js")
const Review = require("./models/review.js");
// const {reviewSchema} = require("./schema.js")

const session = require("express-session")
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js")
const reviewRouter  = require("./routes/review.js")
const userRouter = require("./routes/user.js");

const store = MongoStore.create({ 
  mongoUrl: dbUrl ,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error",() =>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized : true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// app.use(express)
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  ssl:true

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// app.get("/", (req, res) => {
//   res.send("Hello i am root");
// });

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log("s & E Mid",res.locals.success)
  next();
})

// app.get("/demouser",async(req,res) => {
//     let fakeUser = new User({
//       email:"student@gmai.com",
//       username:"sigma-student",
//     })

//     let registerUser =  await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })

// app.get("/signup",(req,res))

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !!"));
})
app.use((err, req, res, next) => {
    let { statusCode=500 ,message="somthing went wrong !!"} = err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});



// app.get("/test", async (req,res)=>{

//     let sample = new Listing({
//         title: "My New Vill",
//         description: "By the beach",
//         price:1200,
//         location:"calangute, Goa",
//         country:"India"
//     });
//     console.log(sample);

//     await sample.save();
//     console.log("sample save")
//     res.send("Yes");
// })
