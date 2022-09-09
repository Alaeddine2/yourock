const mongoose = require("mongoose");

const schema = new mongoose.Schema({
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
  topic: {
    type: String,
    required: true
  },
  first_option_nature: {
    type: Number,
    required: true,
  },
  second_option_nature: {
    type: Number,
    required: true,
  },
  is_activate: {
    type: Boolean,
    default: true
  },
  first_option_url:{
    type: String,
    required: true
  },
  second_option_url:{
    type: String,
    required: true
  },
  voters: [
        {
            "voter_id": String,
            "option": Number
        }, 
    ],
   first_option_score: {
    type: Number,
    default: 0
   },
   second_option_score: {
    type: Number,
    default: 0
   }
});

const pollSchema =  mongoose.model("m_poll", schema);
module.exports = pollSchema;
