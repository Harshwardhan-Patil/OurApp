/**@module authController */

const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const User = require('../models/User');
const Post = require('../models/Post');


/**
 * Render Sign Up page
 * @route /signUp - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
function signUp(req, res) {
  res.render("signUp", {
    errorMessage: "Username is defined",
    showErrorOrNot: "disappear",
  });
}

/**
 * Render Log In page
 * @route /login - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
function login(req, res) {
  res.render("signIn", { errorMessage: "", showErrorOrNot: "disappear" });
}

/**
 * Render Sign in page when error occurred while login
 * @route /re-login - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
function reLogin(req, res) {
  res.render("signIn", {
    errorMessage: "Sorry,Your password was incorrect or username is invalid",
    showErrorOrNot: "appear",
  });
}

//redirect to the home page
function redirect_home_page(req, res) {
  res.redirect("/");
}


/**
 * Register the new users
 * @route /register - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function user_register(req, res) {
  const query_1 = User.where({ username: req.body.username });
  const usernameThatExist = await query_1.findOne();
  
  const query_2 = User.where({ email: req.body.email });
  const emailThatExist = await query_2.findOne();

  if (usernameThatExist === null && emailThatExist === null) {
    User.register(
      { username: req.body.username, email: req.body.email },
      req.body.password,
      (err, user) => {
        err && console.error(err);

        !err &&
          passport.authenticate("local")(req, res, () => {
            res.redirect("/");
          });
      }
    );
  } else if (usernameThatExist !== null && emailThatExist !== null) {
    res.render("signUp", {
      errorMessage: "Username and Email is taken.Try another",
      showErrorOrNot: "appear",
    });
  } else if (usernameThatExist != null) {
    res.render("signUp", {
      errorMessage: "Username is taken.Try another",
      showErrorOrNot: "appear",
    });
  } else if (emailThatExist != null) {
    res.render("signUp", {
      errorMessage: "Email is taken.Try another",
      showErrorOrNot: "appear",
    });
  }
}

/**
 * Login the user
 * @route /login - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
function user_login(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    err && console.error(err);

    !err &&
      passport.authenticate("local", {
        failureRedirect: "/re-login",
      })(req, res, () => {
        res.redirect("/");
      });
  });
}

module.exports = {
  signUp,
  login,
  redirect_home_page,
  user_register,
  user_login,
  reLogin,
};
