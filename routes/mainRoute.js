const express = require("express");
const route = express.Router();
const mainController = require("../controllers/mainController");

route.get("/", mainController.home_page);

route.get("/messages", mainController.inbox);

route.get("/direct/:userId", mainController.connectUsers);

route.get("/post", mainController.post);

route.get("/profile", mainController.profile);

route.get("/profile/followers", mainController.profile_followers);

route.get("/profile/followings", mainController.profile_following);

route.get(
  "/profile/followers/:username_id",
  mainController.end_user_profile_followers
);

route.get(
  "/profile/followings/:username_id",
  mainController.end_user_profile_following
);

route.get("/delete/:post_id", mainController.delete_post);

route.get("/user/profile/:username", mainController.get_users_profile);

route.post("/createPost", mainController.create_post);

route.post("/getUsers", mainController.get_users_username);

route.post("/follow", mainController.follow_users);

route.post("/unfollow", mainController.unfollow_users);

route.post("/likes", mainController.likePost);

route.post("/unlikes", mainController.unLikePost);

module.exports = route;
