const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// ----------------- Middlewares -----------------

module.exports.isLoggedIn = (req, res, next) => {
  console.log("[isLoggedIn] >>> Entering");
  console.log("[isLoggedIn] req.user =", req.user);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    console.log("[isLoggedIn] !!! User not authenticated, redirecting to /login");
    return res.redirect("/login");
  }

  console.log("[isLoggedIn] <<< Exiting");
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  console.log("[savedRedirectUrl] >>> Entering");

  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("[savedRedirectUrl] Found redirectUrl:", req.session.redirectUrl);
  }

  console.log("[savedRedirectUrl] <<< Exiting");
  next();
};

module.exports.isOwner = async (req, res, next) => {
  console.log("[isOwner] >>> Entering");
  let { id } = req.params;
  let listing = await Listing.findById(id);

  console.log("[isOwner] Listing Owner:", listing?.owner);
  console.log("[isOwner] Current User:", res.locals.currUser?._id);

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    console.log("[isOwner] !!! Unauthorized, redirecting...");
    return res.redirect(`/listings/${id}`);
  }

  console.log("[isOwner] <<< Exiting");
  next();
};

module.exports.validateListings = (req, res, next) => {
  console.log("[validateListings] >>> Entering");
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((er) => er.message).join(",");
    console.log("[validateListings] !!! Validation Error:", errMsg);
    throw new ExpressError(400, errMsg);
  }

  console.log("[validateListings] <<< Exiting");
  next();
};

module.exports.validateReview = (req, res, next) => {
  console.log("[validateReview] >>> Entering");
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((er) => er.message).join(",");
    console.log("[validateReview] !!! Validation Error:", errMsg);
    throw new ExpressError(400, errMsg);
  }

  console.log("[validateReview] <<< Exiting");
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  console.log("[isReviewAuthor] >>> Entering");
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  console.log("[isReviewAuthor] Review Author:", review?.author);
  console.log("[isReviewAuthor] Current User:", res.locals.currUser?._id);

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    console.log("[isReviewAuthor] !!! Unauthorized, redirecting...");
    return res.redirect(`/listings/${id}`);
  }

  console.log("[isReviewAuthor] <<< Exiting");
  next();
};


// const Listing = require("./models/listing")
// const Review = require("./models/review.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// // const Review = require("../models/review.js");
// // const {reviewSchema} = require("../schema.js")

// module.exports.isLoggedIn = (req,res,next) =>{
//     console.log("req.User = ",req.user);
//   if(!req.isAuthenticated()){
//     // console.log("Yes >>")
//     req.session.redirectUrl = req.originalUrl;
//     req.flash("error","you must be logged in to create listing!");
//     return res.redirect("/login");
//   }
//   next();
// }

// module.exports.savedRedirectUrl = (req,res,next) =>{
//   console.log("Yes >> saved URl")
//   if(req.session.redirectUrl){
//     res.locals.redirectUrl = req.session.redirectUrl;
//   }
//   next();
// }

// module.exports.isOwner  = async (req,res,next) =>{
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//     console.log("In isOwner MiddleWare ->",res.locals)
//     if(!listing.owner.equals(res.locals.currUser._id)){
//     req.flash("error","You are not the owner of the this listings");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// }

// module.exports.validateListings = (req,res,next) =>{
//     let {error} =listingSchema.validate(req.body);
//     // console.log(e);
//     if(error){
//       let errMsg = error.details.map((er)=>er.message).join(",");
//       throw new ExpressError(400,errMsg)
//     }else{
//       next();
//     }
// }

// module.exports.validateReview = (req,res,next) =>{
//     let {error} =reviewSchema.validate(req.body);
//     // console.log(e);
//     if(error){
//       let errMsg = error.details.map((er)=>er.message).join(",");
//       throw new ExpressError(400,errMsg)
//     }else{
//       next();
//     }
// }

// module.exports.isReviewAuthor = async (req,res,next) =>{
//   let { id,reviewId } = req.params;
//   let review = await Review.findById(reviewId);
//   if(!review.author.equals(res.locals.currUser._id)){
//     req.flash("error","You are not the author of this listings");
//     return res.redirect(`/listings/${id}`)
//   }else{
//     next();
//   }

// }