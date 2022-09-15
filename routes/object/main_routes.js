const express = require("express");
const app = express();
const postRoutes = require("./post_routes");
const notificationRoutes = require("./notification_routes");
const pollRoutes = require("./poll_routes");
const challengeRoutes = require("./challenge_routes");

app.use("/post", postRoutes);
app.use("/notification", notificationRoutes);
app.use("/poll", pollRoutes);
app.use("/challenge", challengeRoutes);

module.exports = app;