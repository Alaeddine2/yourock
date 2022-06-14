const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  is_activate: {
    type: Boolean,
    default: true
  },
  gender: {
    type: String,
  },
  reg_date: {
    type: Date
  },
  dob: {
    type: Date
  },
  class_id: {
    type: String
  },
  class: {
    type: mongoose.Schema.Types.ObjectId, ref: 'm_classes'
  },
  profile_img:{
    type: String,
    default: 'public/1649822484429.png'
  }
});

const studentSchema =  mongoose.model("m_students", schema);
module.exports = studentSchema;
