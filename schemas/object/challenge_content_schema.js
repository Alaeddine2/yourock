const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  creating_date: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: String,
    required: true
  },
  first_option_nature: {
    type: Number,    
    required: true
  },
  second_option_nature: {
    type: Number,
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

const challengeContentSchema =  mongoose.model("m_challenge_content", schema);
module.exports = challengeContentSchema;
