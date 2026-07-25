const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

router.get("/", wrapAsync(async (req, res) => {
  if (!req.user) {
    return res.render("bookings/index.ejs", {
      bookings: [],
      message: "Please log in to view your bookings.",
    });
  }

  const bookings = await Booking.find({ guest: req.user._id }).populate("listing");
  res.render("bookings/index.ejs", { bookings, message: null });
}));

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
  const bookingData = req.body.booking || {};
  const listingId = bookingData.listingId || bookingData.listing || "";
  const checkIn = bookingData.checkIn;
  const checkOut = bookingData.checkOut;

  if (!listingId) {
    req.flash("error", "Booking failed. Please try again.");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
    req.flash("error", "Check-out date must be after check-in date");
    return res.redirect(`/listings/${listing._id}`);
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * listing.price;

  const overlappingBooking = await Booking.findOne({
    listing: listing._id,
    $or: [
      { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
    ]
  });

  if (overlappingBooking) {
    req.flash("error", "Sorry, those dates are already booked.");
    return res.redirect(`/listings/${listing._id}`);
  }

  const booking = new Booking({
    listing: listing._id,
    guest: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
  });

  await booking.save();
  req.flash("success", `Booking confirmed! Total: ₹${totalPrice.toLocaleString("en-IN")}`);
  return res.redirect("/bookings");
}));

module.exports = router;
