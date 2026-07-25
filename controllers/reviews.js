const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.createReview=async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("Success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.updateReview=async(req,res)=>{
  let {id, reviewId}=req.params;
  await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
  req.flash("Success","Review Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyReview=async(req,res)=>{
   let {id , reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("Success","Review Deleted!");
   res.redirect(`/listings/${id}`);
};