const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedIn, validateListings, isOwner } = require("../middleware.js");
// const {} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
// const upload = multer({dest:'uploads/'})
const upload = multer({storage})

router
  .route("/")
  //index route
  .get(wrapAsync(listingController.index))
  // create Routes
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListings,
    wrapAsync(listingController.createListings)
  );
  

  //new Routes
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
//show route
  .get(wrapAsync(listingController.showListings))
  //Update Routes
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    
    validateListings,
    wrapAsync(listingController.updateListings)
  )
  //delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListings));

//edit Routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListings)
);
module.exports = router;

// router.get("/:id", wrapAsync(listingController.showListings));

// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListings,
//   wrapAsync(listingController.updateListings)
// );


// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.deleteListings)
// );


// router.post(
//   "/",
//   isLoggedIn,
//   validateListings,
//   wrapAsync(listingController.createListings)
// );

// router.get("/", wrapAsync(listingController.index));
