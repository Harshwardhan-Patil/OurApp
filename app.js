/**@module app root module for OurApp application */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Auth = require("./models/Auth");
const Connection = require("./models/Connection");
const Message = require("./models/Messages");
const ejs = require("ejs");
const http = require("http");
const socketIo = require("socket.io");
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const mainRoutes = require("./routes/mainRoute");
const authRoutes = require("./routes/authRoute");

/**
 * @desc Store the users Id and their Socket Id when they establish connection
 */
let userIdAndSocketId = [];

//Mongoose connection
(async function connect() {
  await mongoose.connect(process.env.MONGODB_CONNECTION);
})();

const port = process.env.PORT || "3000";

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(require("cors")());
app.use(passport.initialize());
app.use(passport.session());

//set ejs engine
app.set("view engine", "ejs");

//Server initialization
const io = socketIo(server);

io.on("connection", (socket) => {
  //on user connect
  socket.on("connectUser", (userId) => {
    userIdAndSocketId.push({ socketId: socket.id, userId });
  });

  //when user send message to the friend
  socket.on("message", async ({ message, userId, conversationId }) => {
    const user = userIdAndSocketId.find((user) => user.userId === userId);
    const sender = userIdAndSocketId.find(
      (client) => client.socketId === socket.id
    );
    const userMessage = new Message({
      conversationId,
      sender: sender.userId,
      message,
    });
    try {
      const senderMessage = await userMessage.save();
      user && io.to(user.socketId).emit("message", message);
    } catch (error) {
      console.error(error);
    }
  });

  //disconnect from the server
  socket.on("disconnect", () => {
    userIdAndSocketId = userIdAndSocketId.filter(
      (client) => client.socketId != socket.id
    );
  });
});

/**
 * @desc routes
 */
app.use(mainRoutes);
app.use(authRoutes);
app.get("*", (req, res) => {
  res.render("404.ejs");
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
