const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
  let listings = await Listing.findById(id).populate("reviews");
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log("Review : ",newReview)
  listings.reviews.push(newReview);
  await newReview.save();
  await listings.save();

  console.log("Riview Saved !!");
  req.flash("success","New Review Created !")
  res.redirect(`/listings/${listings._id}`);
}

module.exports.destroyReviews = async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{ reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  
  req.flash("success","Review Deleted !")
  res.redirect(`/listings/${id}`);

}