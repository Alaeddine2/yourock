const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  challenger_contant:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_challenge_content",
  },
  challenger_contant_id:{
    type: String,
  },
  is_activate: {
    type: Boolean,
    default: true
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
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_users",
    required: true
  },
  challenger_id: {
    type: String,
  },
  is_started:{
    type: Boolean,
    default: false
  },
  is_completed:{
    type: Boolean,
    default: false
  },
  current_status:{
    type: Number,
    default: 0 //waitting for challenger acceptation
  },
  end_challenge_date:{
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("m_challenge", schema);
