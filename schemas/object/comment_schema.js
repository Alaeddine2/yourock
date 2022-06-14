const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  creating_date: {
    type: Date,
    default: Date.now
  },
  last_update: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_users",
    required: true
  },
  owner_id: {
    type: String,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_posts",
    required: true
  },
  post_id: {
    type: String,
  }
});

const commentSchema =  mongoose.model("m_comments", schema);
module.exports = commentSchema;
