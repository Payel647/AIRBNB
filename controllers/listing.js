const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };
module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showListing= async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{ path:"author"},}).populate("owner");
  const bookings = await Booking.find({ listing: id });
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, bookings, mapboxToken: process.env.MAP_API_KEY });
}
module.exports.createListing=async(req, res,next) => {
  console.log(req.body);
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  let result = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location)}.json?key=${process.env.MAP_TILER_KEY}`);
  result = await result.json();
  const location = result.features[0];
  const ans = location.geometry.coordinates;
  newListing.image={url, filename};
  newListing.geometry.coordinates=ans;
  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("Success","New Listing Created!");
  res.redirect("/listings");
};
module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs",{listing,originalImageUrl});
};
module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url, filename};
  await listing.save();
  }
  req.flash("Success","Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyListing=async(req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("Success","Listing Deleted!");
  res.redirect("/listings");
};