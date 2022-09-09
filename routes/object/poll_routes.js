const express = require("express");
const userSchema = require("../../schemas/actors/user_schema");
const pollSchema = require("../../schemas/object/poll_schema");
const mongoose = require("mongoose");
const utils = require("../../utils/util_methods");
const constants = require("../../utils/constants");
const tokenSchema = require("../../schemas/token_schema");
const commentSchema = require("../../schemas/object/comment_schema");
const notificationSchema = require("../../schemas/object/notification_schema");

const router = express.Router();

//add new poll
router.post("/add", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
            message: "Invalid Token",
            });
        }
        const newPoll = new pollSchema({
            topic: req.body.topic,
            owner_id: resultList[0].user_id,
            owner: resultList[0].user_id,
            first_option_nature: req.body.first_option_nature,
            second_option_nature: req.body.second_option_nature,
            first_option_url: req.body.first_option_url,
            second_option_url: req.body.second_option_url
        });
        newPoll.save().then(result => {
            res.status(200).json({
                code: "API.POLL.SUCESS",
                message: "Poll added successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POLL.FAIL",
                message: "POLL adding failed",
                error: err
            });
        });
    });
});

//get all polls of current user
router.get("/me", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        pollSchema
        .find({owner_id: resultList[0].user_id})
        .sort({ creating_date: -1 })
        .populate("owner")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POLL.GET.CURRENT.SUCESS",
                message: "All current User polls fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POLL.GET.CURRENT.FAIL",
                message: "All current User polls fetching failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.POLL.GET.CURRENT.FAIL",
            message: "All current User polls fetching failed",
            error: err
        });
    });
});

//get all polls
router.get("/all", utils.extractToken, (req, res) => {
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
        pollSchema
        .find({})
        .populate("owner")
        .sort({ creating_date: 1 })
        .skip(req.body.skip)
        .limit(req.body.limit)
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POLL.GET.SUCESS",
                message: "All Polls fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POLL.GET.FAIL",
                message: "All polls fetching failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.POLL.GET.FAIL",
            message: "All polls fetching failed",
            error: err
        });
    });
});

//get poll by id
router.get("/:id", utils.extractToken, (req, res) => {
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
        pollSchema
        .find({ _id: req.params.id })
        .populate("owner")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.Poll.GET.SUCESS",
                message: "Poll fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.Poll.GET.FAIL",
                message: "Poll fetching failed",
                error: err
            });
        });
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.Poll.GET.FAIL",
            message: "Poll fetching failed",
            error: err
        });
    });
});

//get poll by owner id
router.get("/user/:id", utils.extractToken, (req, res) => {
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
        pollSchema
        .find({ owner_id: req.params.id })
        .populate("owner")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.Poll.GET.SUCESS",
                message: "Poll fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.Poll.GET.FAIL",
                message: "Poll fetching failed",
                error: err
            });
        });
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.Poll.GET.FAIL",
            message: "Poll fetching failed",
            error: err
        });
    });
});

//update post
router.put("/update", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        pollSchema
        .findOneAndUpdate({ _id: req.body.id }, { $set: { topic: req.body.topic, first_option_nature: req.body.first_option_nature, second_option_nature: req.body.second_option_nature, first_option_url: req.body.first_option_url, second_option_url: req.body.second_option_url } }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POLL.UPDATE.SUCESS",
                message: "POLL updated successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POLL.UPDATE.FAIL",
                message: "POLL updating failed",
                error: err
            });
        });
    });
});

//delete post by id
router.delete("/:id", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        pollSchema
        .find({ _id: req.params.id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POLL.DELETE.FAIL",
                    message: "Poll not found",
                });
            }
            pollSchema
            .deleteOne({ _id: req.params.id })
            .exec()
            .then(deletingResult => {
                res.status(200).json({
                    code: "API.POLL.DELETE.SUCESS",
                    message: "Poll deleted successfully",
                    result: deletingResult
                });
            }
            ).catch(err => {
                res.status(400).json({
                    code: "API.POLL.DELETE.FAIL",
                    message: "Poll deletion failed",
                    error: err
                });
            }
            );
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POLL.DELETE.FAIL",
                message: "Poll deletion failed",
                error: err
            });
        }
        );
    });
});

//vote for post
router.post("/vote", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        pollSchema
        .findOne({ _id: req.body.poll_id })
        .exec()
        .then(result => {
            if(result == null){
                return res.status(400).json({
                    code: "API.POLL.VOTE.ADD.FAIL",
                    message: "POLL not found"
                });
            }
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POLL.VOTE.ADD.FAIL",
                    message: "POLL not found"
                });
            }
            if(req.body.selected_option == 1){
                console.log(req.body.selected_option);
                pollSchema
                .findOneAndUpdate({ _id: req.body.poll_id },  { $inc: { first_option_score: 1 }  
                    , $push: {voters: 
                    {
                        "voter_id": resultList[0].user_id,
                        "option": 1  //1: first option - 2: second option
                    }
                }
                }
                )
                .exec()
                .then(voteResult => {
                    const notificationModel = new notificationSchema({
                        post_id: null,
                        post: null,
                        action_type: 0,
                        actuator: req.body.user_id,
                        actuator_id: req.body.user_id,
                        notification_type: 1,
                        owner_id: resultList[0].user_id,
                        owner: resultList[0].user_id,
                        comment_id: null,
                        poll_id: req.body.poll_id,
                        creating_date: Date.now()
                    });
                    notificationModel.save();
                    res.status(200).json({
                        code: "API.POLL.VOTE.ADD.SUCESS",
                        message: "Vote added successfully",
                        result: voteResult
                    });
                }
                ).catch(err => {
                    console.log(err);
                    res.status(406).json({
                        code: "API.POLL.VOTE.ADD.FAIL",
                        message: "Vote adding failed",
                        error: err
                    });
                });
            }else{
                pollSchema
                .findOneAndUpdate({ _id: req.body.poll_id },  { $inc: { second_option_score: 1 }  , $push: {voters: 
                    {
                        voter_id: resultList[0].user_id,
                        option: 2
                    }
                }})
                .exec()
                .then(voteResult => {
                    const notificationModel = new notificationSchema({
                        post_id: null,
                        post: null,
                        action_type: 0,
                        actuator: req.body.user_id,
                        actuator_id: req.body.user_id,
                        notification_type: 1,
                        owner_id: resultList[0].user_id,
                        owner: resultList[0].user_id,
                        comment_id: null,
                        poll_id: req.body.poll_id,
                        creating_date: Date.now()
                    });
                    notificationModel.save();
                    res.status(200).json({
                        code: "API.POLL.VOTE.ADD.SUCESS",
                        message: "Vote added successfully",
                        result: voteResult
                    });
                }
                ).catch(err => {
                    res.status(406).json({
                        code: "API.POLL.VOTE.ADD.FAIL",
                        message: "Vote adding failed",
                        error: err
                    });
                });
            }
        });
    });
});
module.exports = router;