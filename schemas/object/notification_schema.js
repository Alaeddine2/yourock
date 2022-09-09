const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  notification_type: {
    type: Number, // 0: Post - 1: Poll - 2: Challenge
    required: true
  },
  creating_date: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_users",
  },
  owner_id: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_posts"
  },
  post_id: {
    type: String,
  },
  action_type:{
    type: Number, // 0: add new comment - 1: vote
    default: 0,
    required: true
  },
  actuator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_users",
  },
  actuator_id: {
    type: String,
  },
  isAlreadyReaded: {
    type: Boolean,
    default: false
  },
  comment_id: {
    type: String,
  },
  poll_id: {
    type: String,
  }
});

const notificationSchema =  mongoose.model("m_notification", schema);
module.exports = notificationSchema;
