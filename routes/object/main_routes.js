const express = require("express");
const app = express();
const postRoutes = require("./post_routes");

app.use("/post", postRoutes);

module.exports = app;