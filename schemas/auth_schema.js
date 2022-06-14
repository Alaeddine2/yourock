const mongoose = require("mongoose");
const constants = require("../utils/constants");

const schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password_hash: {
        type: String
    },
    role: {
        type: String
    }
});

const authSchema = mongoose.model('auths', schema);
module.exports = authSchema;
