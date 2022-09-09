/** @module mainController */

/**
 * @requires module:models/User
 * @requires module:models/Post
 * @requires module:models/Connection
 * @requires module:models/Messages
 */
const User = require("../models/User");
const Post = require("../models/Post");
const Connection = require("../models/Connection");
const Message = require("../models/Messages");

/**
 * Home page
 * @function home_page
 * @route / - Get Request
 * @type {function}
 * @param {Object} req - HTTP requests
 * @param {Object} res - HTTP response
 */
async function home_page(req, res) {
  if (req.isAuthenticated()) {
    try {
      console.log(req.session);
      const _id = req.session.passport.user.id;
      const user = await User.findById({ _id });
      const { following } = user;
      let postLikeClass = [];
      let followingPosts = [];
      for (let i = 0; i < following.length; i++) {
        const followingPost = await Post.find({ username: following[i] }).sort({
          createdAt: -1,
        });
        postLikeClass = followingPost.map((post) => {
          return post.likes.includes(_id) ? "fa-solid" : "fa-regular";
        });
        followingPosts.push(followingPost);
      }

      res
        .status(200)
        .render("home", { posts: followingPosts || null, postLikeClass });
    } catch (error) {}
  } else {
    res.redirect("/login");
  }
}

/**
 * Message or Inbox
 * @route /message - Get Request
 * @type {function}
 * @param {Object} req - HTTP requests
 * @param {Object} res - HTTP response
 */

async function inbox(req, res) {
  try {
    const userId = req.session.passport.user.id;
    const connections = await Connection.find({ members: { $in: [userId] } });

    let members = [];
    let membersId = [];

    connections.forEach((connection) => {
      members.push(
        connection.members.filter((member) => {
          return member !== userId;
        })
      );
      membersId.push(connection._id);
    });

    const usersInfo = [];

    for (let i = 0; i < members.length; i++) {
      const member = await User.findById({ _id: members[i] });
      usersInfo.push(member);
    }

    const chatClass = {
      defaultMessage: "flex",
      chat: "none",
    };

    res.status(200).render("chat", {
      user: req.session.passport.user,
      endUser: null,
      usersInfo,
      connection: membersId,
      messages: [],
      chatClass,
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Shows Users Chat/Messages
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 * @param {Object} connection - Two connected members Ids
 */

async function showUsersChat(req, res, connection) {
  const messages = await Message.find({ conversationId: connection._id });
  const endUserId = connection.members.find(
    (member) => req.session.passport.user.id !== member
  );

  const endUserUsername = await User.findById({ _id: endUserId });

  const userId = req.session.passport.user.id;
  const connections = await Connection.find({ members: { $in: [userId] } });

  let members = [];
  let membersId = [];

  connections.forEach((connection) => {
    members.push(
      connection.members.filter((members) => {
        return members !== userId;
      })
    );
    membersId.push(connection._id);
  });

  const usersInfo = [];

  for (let i = 0; i < members.length; i++) {
    const member = await User.findById({ _id: members[i] });
    usersInfo.push(member);
  }

  const chatClass = {
    defaultMessage: "none",
    chat: "block",
  };
  res.status(200).render("chat", {
    user: req.session.passport.user,
    endUser: endUserUsername.username,
    usersInfo,
    connection: membersId,
    messages,
    chatClass,
  });
}

/**
 * Connect two users to start the conversation
 * @route /direct/:userId
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTp Response
 */

async function connectUsers(req, res) {
  try {
    const user1 = req.session.passport.user.id;
    const user2 = req.params.userId;

    // Check users are already connected to each other or Not
    const isConnectionEstablished = await Connection.findOne({
      members: { $size: 2, $all: [user1, user2] },
    });

    if (isConnectionEstablished === null) {
      const connection = new Connection({
        members: [user1, user2],
      });

      const members = await connection.save();
      showUsersChat(req, res, members);
    } else {
      showUsersChat(req, res, isConnectionEstablished);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Show Logged In users Profile page
 * @route /profile - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function profile(req, res) {
  try {
    const user_id = req.session.passport.user.id;
    const query = User.where({ _id: user_id });
    const user = await query.findOne();

    const posts = await Post.find({ userId: user_id }).sort({ createdAt: -1 });

    const postLikeClass = posts.map((post) => {
      return post.likes.includes(user_id) ? "fa-solid" : "fa-regular";
    });

    const { username, followers, following } = user;

    res.status(200).render("profile", {
      username,
      followersCount: followers.length,
      followingCount: following.length,
      posts,
      postLikeClass,
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Shows logged in users following
 * @route /profile/following - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function profile_following(req, res) {
  try {
    const _id = req.session.passport.user.id;
    const user = await User.findById({ _id });
    const { following } = user;

    const follows = following.map((following) => {
      return {
        username: following,
        value: "Following",
        class: "following-btn",
      };
    });
    res.render("followers-following", { follows });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Shows logged in users followers and other user following and followers page
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 * @param {String} _id - User Id
 */
async function users_followers_and_following(req, res, _id) {
  try {
    const user = await User.findById({ _id });
    const { followers, following } = user;

    const follows = followers.map((follower) => {
      if (follower === req.session.passport.user.username) {
        return {
          username: follower,
          value: "",
          class: "disappear",
        };
      } else if (following.includes(follower)) {
        return {
          username: follower,
          value: "Following",
          class: "following-btn",
        };
      } else {
        return {
          username: follower,
          value: "Follow",
          class: "follow-btn",
        };
      }
    });

    res.render("followers-following", { follows });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Shows logged in users followers
 * @route /profile/followers - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function profile_followers(req, res) {
  users_followers_and_following(req, res, req.session.passport.user.id);
}

/**
 * Shows other user following
 * @route /profile/following/:username_id - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 * @param {String} _id - User Id
 */
async function end_user_profile_following(req, res) {
  users_followers_and_following(req, res, req.params.username_id);
}

/**
 * Shows  other user  followers page
 * @route /profile/followers/:username_id - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 * @param {String} _id - User Id
 */
async function end_user_profile_followers(req, res) {
  users_followers_and_following(req, res, req.params.username_id);
}

/**
 * Render the page to create new post
 * @route /post - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
function post(req, res) {
  res.status(200).render("create-post");
}

/**
 * Create new post
 * @route /createPost - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function create_post(req, res) {
  try {
    const user_id = req.session.passport.user.id;
    const user_name = req.session.passport.user.username;
    const posts = new Post({
      userId: user_id,
      username: user_name,
      title: req.body.title,
      bodyContent: req.body.bodyContent,
    });
    const post = await posts.save();
    res.redirect("/profile");
  } catch (error) {}
}

/**
 * Delete  post
 * @route /delete/:post_id - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function delete_post(req, res) {
  try {
    const _id = req.params.post_id;
    const deletePost = await Post.findByIdAndDelete({ _id });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

/**
 * Send the users username while logged user is searching in search box
 * @route /getUsers - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function get_users_username(req, res) {
  try {
    //trim for avoiding white spaces
    const payload = req.body.payload.trim();

    const searchResult = await User.find({
      username: { $regex: new RegExp("^" + payload + ".*", "i") },
    }).exec();

    // return all the user excludes the logged user
    let search = searchResult.filter(
      (user) => user.username !== req.session.passport.user.username
    );

    search = search.slice(0, 5);
    res.send({ payload: search });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

/**
 * Show the profile of Other user
 * @route /user/profile/:username - GET Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function get_users_profile(req, res) {
  try {
    const usernameOfMainUser = req.session.passport.user.username;
    const name = req.params.username;

    if (name === usernameOfMainUser) {
      res.redirect("/profile");
      return;
    }
    const query = User.where({ username: name });
    const user = await query.findOne();

    const { _id, username, followers, following } = user;
    const posts = await Post.find({ userId: _id }).sort({ createdAt: -1 });

    const postLikeClass = posts.map((post) => {
      return post.likes.includes(_id) ? "fa-solid" : "fa-regular";
    });

    const followingUI = {
      value: "Following",
      class: "following-btn",
    };

    const followersUI = {
      value: "Follow",
      class: "follow-btn",
    };
    const followOrNot = followers.includes(usernameOfMainUser)
      ? followingUI
      : followersUI;

    res.status(200).render("users-profile", {
      _id,
      username,
      followersCount: followers.length,
      followingCount: following.length,
      followOrNot,
      posts,
      postLikeClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

/**
 * Handle the follow and unfollow of the users
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 * @param {string} pushOrPull - push the user or pull the user from their following and followers
 */
async function follow_unfollow_users(req, res, pushOrPull) {
  try {
    const followingUsername = req.body.user;
    const username = req.session.passport.user.username;
    // Increase or decrease the followers of end user
    const endUser = await User.findOneAndUpdate(
      { username: followingUsername },
      { [pushOrPull]: { followers: username } },
      { new: true }
    );

    // Increase or decrease the following of the main user
    const mainUser = await User.findOneAndUpdate(
      { username },
      { [pushOrPull]: { following: followingUsername } },
      { new: true }
    );

    res.redirect(`/user/profile/${followingUsername}`);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Follow the user
 * @route /follow - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function follow_users(req, res) {
  follow_unfollow_users(req, res, "$push");
}

/**
 * Unfollow the user
 * @route /unfollow - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function unfollow_users(req, res) {
  follow_unfollow_users(req, res, "$pull");
}

/**
 * Handle the like and unlike of the posts
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 * @param {Object} pushOrPull - push the user or pull the user from post like section
 */
async function like_unlike_Post(req, res, pushOrPull) {
  try {
    const user = await Post.findByIdAndUpdate(
      req.body.like,
      { [pushOrPull]: { likes: req.session.passport.user.id } },
      { new: true }
    );

    res.status(200).send({ likeCount: user.likes.length });
  } catch (error) {
    res.status(500).send(error);
  }
}

/**
 * Like the posts
 * @route /likes - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function likePost(req, res) {
  const isLiked = await Post.findById(req.body.like);
  isLiked.likes.includes(req.session.passport.user.id)
    ? res.status(200).send({ likeCount: isLiked.likes.length })
    : like_unlike_Post(req, res, "$push");
}

/**
 * UnLike the posts
 * @route /unlikes - POST Request
 * @param {Object} req - HTTP Request
 * @param {Object} res - HTTP Response
 */
async function unLikePost(req, res) {
  like_unlike_Post(req, res, "$pull");
}

module.exports = {
  home_page,
  inbox,
  connectUsers,
  post,
  create_post,
  profile,
  profile_following,
  profile_followers,
  end_user_profile_followers,
  end_user_profile_following,
  delete_post,
  get_users_username,
  get_users_profile,
  follow_users,
  unfollow_users,
  likePost,
  unLikePost,
};
