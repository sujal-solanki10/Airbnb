const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const { Passport } = require("passport");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(WrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);
module.exports = router;

// router.get("/signup", userController.renderSignupForm);

// router.post(
//   "/signup",
//   WrapAsync(userController.signup)
// );

// router.get("/login", userController.renderLoginForm);

// router.post(
//   "/login",
//   savedRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );
