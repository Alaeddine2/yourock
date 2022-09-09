const express = require("express");
const userSchema = require("../../schemas/actors/user_schema");
const postSchema = require("../../schemas/object/post_schema");
const mongoose = require("mongoose");
const utils = require("../../utils/util_methods");
const constants = require("../../utils/constants");
const tokenSchema = require("../../schemas/token_schema");
const commentSchema = require("../../schemas/object/comment_schema");
const notificationSchema = require("../../schemas/object/notification_schema");

const router = express.Router();

//get all notifications of current user
router.post("/me", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .sort({ creating_date: 1 })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        notificationSchema
        .find({owner_id: resultList[0].user_id})
        .populate("owner")
        .populate("actuator")
        .populate("post")
        .skip(req.body.skip)
        .limit(req.body.limit)
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.NOTIFICATION.GET.SUCESS",
                message: "All current user notification fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.NOTIFICATION.GET.FAIL",
                message: "All current user notification fetching failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.NOTIFICATION.GET.FAIL",
            message: "All current user notification fetching failed",
            error: err
        });
    });
});

//make notification as readed
router.put("/readed", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        notificationSchema
        .findOneAndUpdate({ _id: req.body.id }, { $set: { isAlreadyReaded: true } })
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.NOTIFICATION.EDIT.SUCESS",
                message: "Notification updated successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.NOTIFICATION.EDIT.FAIL",
                message: "make notification as readed",
                error: err
            });
        });
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.NOTIFICATION.EDIT.FAIL",
            message: "make notification as readed",
            error: err
        });
    });
});

module.exports = router;