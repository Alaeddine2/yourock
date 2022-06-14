const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  post_nature: {
    type: Number,
    required: true,
  },
  is_activate: {
    type: Boolean,
    default: true
  },
  post_url:{
    type: String,
    default: 'public/1649822484429.png',
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
  votes: {
    type: Number,
    default: 0
  },
  voters: {
    type: Array,
    default: []
  }
});

const postSchema =  mongoose.model("m_posts", schema);
module.exports = postSchema;
