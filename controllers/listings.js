const Listing = require("../models/listing");
const categoryLabels = require("../models/categoryLabels");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //object functality

//Index page
module.exports.index = async (req, res) => {
  console.log("[INDEX] >>> Entering index()");
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  console.log("[INDEX] <<< Exiting index()");
};

//new Form
module.exports.renderNewForm = (req, res) => {
  console.log("[NEW FORM] >>> Entering renderNewForm()");
  res.render("listings/new.ejs");
  console.log("[NEW FORM] <<< Exiting renderNewForm()");
};

//show listings
module.exports.showListings = async (req, res) => {
  console.log("[SHOW] >>> Entering showListings()");
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    console.log("[SHOW] !!! Listing not found, redirecting...");
    req.flash("error", "Listing you requested for does nor exist !");
    res.redirect("/listings");
    console.log("[SHOW] <<< Exiting showListings() - listing not found");
    return;
  }
  console.log("[SHOW] Listing ID:", id);
  res.render("listings/show.ejs", { listing });
  console.log("[SHOW] <<< Exiting showListings()");
};

//create
module.exports.createListings = async (req, res, next) => {
  console.log("[CREATE] >>> Entering createListings()");
  console.log("Listings -> ", req.body.listing.location);
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // console.log("Response-> ",);

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let saveListing = await newListing.save();
  console.log("ave ->", saveListing);
  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
  console.log("[CREATE] <<< Exiting createListings()");
};

//edit form
module.exports.editListings = async (req, res) => {
  console.log("[EDIT] >>> Entering editListings()");
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    console.log("[EDIT] !!! Listing not found, redirecting...");
    req.flash("error", "Listing you requested for does nor exist !");
    res.redirect("/listings");
    console.log("[EDIT] <<< Exiting editListings() - listing not found");
    return;
  }
  console.log("[EDIT] Data found:", listing);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
  console.log("[EDIT] <<< Exiting editListings()");
};

//update
module.exports.updateListings = async (req, res) => {
  console.log("[UPDATE] >>> Entering updateListings()");
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let response = await geocodingClient
    .forwardGeocode({
      query: listing.location,
      limit: 1,
    })
    .send();
  listing.geometry = response.body.features[0].geometry;
  await listing.save();
  listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
  console.log("[UPDATE] <<< Exiting updateListings()");
};

//delete
module.exports.deleteListings = async (req, res) => {
  console.log("[DELETE] >>> Entering deleteListings()");
  let { id } = req.params;
  let deletedListings = await Listing.findByIdAndDelete(id);
  console.log("[DELETE] Deleted listing:", deletedListings);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
  console.log("[DELETE] <<< Exiting deleteListings()");
};

//search
module.exports.searchListing = async (req, res) => {
  console.log("Yes search");
  let query = req.query.search.toLowerCase();
  let allListings = [];
  console.log("Found listings for category:", categoryLabels[query]);
  // If the query is present and the category exists in categoryLabels
  if (query && categoryLabels[query.toLowerCase()]) {
    allListings = await Listing.find({ category: categoryLabels[query] });
    console.log("Found listings for category:", query);
    console.log("\n------------",allListings);
    // If no listings are found for the category
    if (allListings.length === 0) {
      req.flash("error", "No listings found for the selected category!");
      return res.redirect("/listings"); // Redirecting if no results are found
    }

  } else {
    // If the query is not for a category, perform a general search (title or location)
    allListings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
      ]
    });
    console.log("\n------------",allListings);
    // If no listings match the search criteria
    if (allListings.length === 0) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
  }

  // If listings are found, render the page with the results
  res.render("listings/index.ejs", { allListings });
};


// const Listing = require("../models/listing");

// //Index page
// module.exports.index = async (req, res) => {
//   let allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// //new Form
// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new.ejs");
//   // res.send("yes");
// };

// //show listings
// module.exports.showListings = async (req, res) => {
//   // throw new ExpressError(404,"page Not Found");
//   let { id } = req.params;
//   let listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");
//   if (!listing) {
//     req.flash("error", "Listing you requested for does nor exist !");
//     res.redirect("/listings");
//   }
//   console.log("id : ", id);
//   // res.send("Yes : ",id);
//   console.log(listing);
//   res.render("listings/show.ejs", { listing });
// };

// //create
// module.exports.createListings = async (req, res, next) => {
//   // console.log(req.body.listing);
//   let url = req.file.path;
//   let filename = req.file.filename;

//   // console.log(url,"...",filename);
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = {url,filename};
//   // console.log("New User ->", req.user);
//   await newListing.save();
//   req.flash("success", "New Listing Created !");
//   res.redirect("/listings");
// };

// //edit

// module.exports.editListings = async (req, res) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listing you requested for does nor exist !");
//     res.redirect("/listings");
//   }
//   console.log("DATA + = ", listing);
//   res.render("listings/edit.ejs", { listing });
// };

// //update

// module.exports.updateListings = async (req, res) => {
//   // console.log("Yes    ", { ...req.body.listing });
//   let { id } = req.params;
//   let listing =   await Listing.findByIdAndUpdate(id, {...req.body.listing});

//   if(typeof req.file !== 'undefinded'){
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url,filename};
//     await listing.save();
//   }
//   req.flash("success", "Listing Updated !");
//   res.redirect(`/listings/${id}`);
// };

// //delete

// module.exports.deleteListings = async (req, res) => {
//   let { id } = req.params;
//   let deletedListings = await Listing.findByIdAndDelete(id);
//   console.log("Deleted : ", deletedListings);
//   req.flash("success", "Listing Deleted !");
//   res.redirect("/listings");
// };
