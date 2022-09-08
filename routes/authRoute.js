const express = require("express");
const auth = express.Router();

const passport = require("passport");
const authController = require('../controllers/authController');


auth.get("/signUp", authController.signUp);

auth.get("/login", authController.login);

auth.get("/re-login",authController.reLogin);

auth.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

auth.get(
  "/auth/google/home",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.redirect_home_page
);

auth.get(
  "/auth/facebook",
  passport.authenticate("facebook")
);

auth.get(
  "/auth/facebook/home",
  passport.authenticate("facebook",{failureRedirect:"/login"}),
  authController.redirect_home_page
)

auth.post("/register", authController.user_register);

auth.post("/login", authController.user_login);

module.exports = auth;
