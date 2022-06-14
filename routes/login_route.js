const express = require("express");
const authSchema = require("../schemas/auth_schema");
const tokenSchema = require("../schemas/token_schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const configs = require("../config/config.json");
const constants = require("../utils/constants");
const utils = require("../utils/util_methods");
const mongoose = require("mongoose");

const router = express.Router();

//login
router.post("/", (req, res) => {
    authSchema.find( { $or: [{'email': req.body.email}]},
        function(err, userList){
            if(req.body.password == null || req.body.password == ""){
                res.status(400).send({
                    code: "API.PASSWORDS_MISSING",
                    message: "Password is required"
                });
            }else{
                if (userList.length < 1) {
                    return res.status(400).json({
                        code: "API.ATH.FAIL",
                        message: "Authorization Failed!"
                    });
                } else if (userList && bcrypt.compareSync(req.body.password, userList[0].password_hash)) {
                    //correct password
                    const JWT_KEY = configs.JWT_KEY;
                    const token = jwt.sign(
                        {
                            user_type: userList[0].user_type,
                            user_id: userList[0].user_id
                        },
                        JWT_KEY,
                        {
                            expiresIn: "1000h"
                        }
                    );
                    const tokenModel = new tokenSchema({
                        user_id: userList[0].user_id,
                        user_type: userList[0].role,
                        token: token
                    });
                    console.log("Arrived until token write");
                    tokenModel.save().catch(err => { // todo check for previous  tokens for the same userID and delete. implement async to expire saved tokens
                        console.log("Error in saving token during login: " + err.message);
                    });
                    // console.log(admin);
                    return res.status(200).json({
                        code: "API.ATH.SUCESS",
                        message: "Authorization Success",
                        token: token,
                        user_type: userList[0].user_type,
                        user_id: userList[0].user_id
                    });
                }
                res.status(400).json({
                    code: "API.ATH.FAIL",
                    message: "Authorization Failed!"
                });
            }
        });
});

//logout
router.post("/out", (req, res) => {
    //test if token is valid and if so, delete it
    const token = req.headers.authorization;
    if (token) {
        tokenSchema.findOneAndDelete({token: token.substring(7)}, function(err, reply){
            console.log(reply);
            if(err){    
                return res.status(400).json({
                    code: "API.INVALID_TOKEN",
                    message: "Invalid token"
                });
            }
            if(reply){
                return res.status(200).json({
                    code: "API.LOGOUT.SUCESS",
                    message: "Logout Success"
                });
            }
            if(reply == null){
                return res.status(406).json({
                    code: "API.LOGOUT.FAIL",
                    message: "Token not found"
                });
            }
        });
    } else {
        return res.status(400).json({
            code: "API.TOKEN_MISSING",
            message: "token is required"
        });
    }
});

// Verify whether the token is correct
router.post("/verifyToken", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(tokenList => {
            if (tokenList.length < 1) {
                return res.status(401).json({
                    message: "Verification Failed!"
                });
            }
            res.json({
                message: "JWT Token is Valid",
                user_type: tokenList[0].user_type,
                user_id: tokenList[0].user_id
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;