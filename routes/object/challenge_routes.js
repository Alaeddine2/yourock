const express = require("express");
const userSchema = require("../../schemas/actors/user_schema");
const challengeSchema = require("../../schemas/object/challenge_schema");
const challengeContentSchema = require("../../schemas/object/challenge_content_schema");
const utils = require("../../utils/util_methods");
const tokenSchema = require("../../schemas/token_schema");
const notificationSchema = require("../../schemas/object/notification_schema");
const { findByIdAndUpdate } = require("../../schemas/actors/user_schema");

const router = express.Router();

//add new challenge
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
        const newChallengeContent = new challengeContentSchema({
            topic: req.body.topic,
            first_option_nature: req.body.first_option_nature,
            second_option_nature: req.body.second_option_nature,
            first_option_url: req.body.first_option_url,
            second_option_url: req.body.second_option_url
        });
        const newChallenge = new challengeSchema({
            challenger_contant_id: newChallengeContent._id,
            challenger_contant: newChallengeContent._id,
            challenger_id: req.body.challenger_id,
            challenger: req.body.challenger_id,
            owner_id: resultList[0].user_id,
            owner: resultList[0].user_id,
            end_challenge_date: req.body.end_challenge_date
        });
        newChallengeContent.save().then(result => {
            newChallenge.save().then(resulte => {
                const notificationModel = new notificationSchema({
                    post_id: null,
                    post: null,
                    action_type: 0,
                    actuator: resultList[0].user_id,
                    actuator_id: resultList[0].user_id,
                    notification_type: 2,
                    owner_id: req.body.challenger_id,
                    owner: req.body.challenger_id,
                    comment_id: null,
                    poll_id: null,
                    creating_date: Date.now(),
                    challenge: resulte._id,
                    challenge_id: resulte._id
                });
                notificationModel.save();
                res.status(200).json({
                    code: "CHALLENGE.CREATION.SUCESS",
                    message: "challenge added successfully",
                    result: resulte
                });
            }).catch(err => {
                res.status(400).json({
                    code: "API.Challenge.CREATION.FAIL",
                    message: "New challenge adding failed",
                    error: err
                });
            });
        }).catch(err => {
            res.status(400).json({
                code: "API.Challenge.CREATION.FAIL",
                message: "New challenge adding failed",
                error: err
            });
        });
    });
});

router.get("/refuse/:id", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        challengeSchema
        .findById(req.params.id)
        .exec()
        .then(result => {
            console.log(result);
            if(result == null)
                res.status(400).json({
                    code: "API.CHALLENGE.REJECT.FAIL",
                    message: "Challenge not found",
                    error: "Challenge not found"
                });
            if(resultList[0].user_id != result.challenger_id)
                res.status(400).json({
                    code: "API.CHALLENGE.REJECT.FAIL",
                    message: "you are not the challenger",
                    error: "you are not the challenger"
                });
            challengeSchema.findByIdAndUpdate({ _id: req.params.id }, { $set: { is_activate: false, current_status: 1, last_update: Date.now() } }, { new: true })
            .exec().then(result =>{
                const notificationModel = new notificationSchema({
                    post_id: null,
                    post: null,
                    action_type: 1,
                    actuator: resultList[0].user_id,
                    actuator_id: resultList[0].user_id,
                    notification_type: 2,
                    owner_id: result.owner_id,
                    owner: result.owner_id,
                    comment_id: null,
                    poll_id: null,
                    creating_date: Date.now(),
                    challenge: result._id,
                    challenge_id: result._id
                });
                notificationModel.save();
                res.status(200).json({
                    code: "API.CHALLENGE.REJECT.SUCCESS",
                    message: "the challenger reject the challenge",
                    result: result
                });
            })
        }
        ).catch(err => {
            console.log(err);
            res.status(401).json({
                code: "API.CHALLENGE.REJECT.FAIL",
                message: "Challenge reject is failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        console.log(err);   
        res.status(401).json({
            code: "API.CHALLENGE.REJECT.FAIL",
            message: "Challenge reject is failed",
            error: err
        });
    });
});

router.post("/accept", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        if(req.body.nature == null || req.body.option_url == null){
            res.status(401).json({
                code: "API.CHALLENGE.ACCPTED.FAIL",
                message: "mission fields",
                error: "mission fields"
            });
        }
        challengeSchema.findByIdAndUpdate({ _id: req.body.post_id }, { $set: { is_started: true, current_status: 2, last_update: Date.now() } }, { new: true })
            .exec().then(result =>{
                challengeContentSchema.findByIdAndUpdate({ _id: result._id }, { $set: { second_option_nature: req.body.nature, second_option_url: req.body.option_url } }, { new: true })
                .exec().then(result1 =>{
                    const notificationModel = new notificationSchema({
                        post_id: null,
                        post: null,
                        action_type: 3,
                        actuator: resultList[0].user_id,
                        actuator_id: resultList[0].user_id,
                        notification_type: 2,
                        owner_id: result.owner_id,
                        owner: result.owner_id,
                        comment_id: null,
                        poll_id: null,
                        creating_date: Date.now(),
                        challenge: resulte._id,
                        challenge_id: resulte._id
                    });
                    notificationModel.save();
                    res.status(200).json({
                        code: "API.CHALLENGE.ACCPTED.SUCCESS",
                        message: "the challenger accept the challenge",
                        result: "Challenge accepted"
                    });
                })
                }
                ).catch(err => {
                    res.status(401).json({
                        code: "API.CHALLENGE.ACCPTED.FAIL",
                        message: "Challenge accept is failed",
                        error: err
                    });
                }
                );
            }).catch(err => {
            res.status(401).json({
                code: "AAPI.CHALLENGE.ACCPTED.FAIL",
                message: "API.CHALLENGE.ACCPTED.FAIL",
                error: err
            });
        }
        );
});

//get all challengs of current user
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
        challengeSchema
        .find({owner_id: resultList[0].user_id})
        .sort({ creating_date: -1 })
        .populate("owner")
        .populate("challenger_contant")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.CHALLENGE.GET.CURRENT.SUCESS",
                message: "All current User CHALLENGE fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.CHALLENGE.GET.CURRENT.FAIL",
                message: "All current User CHALLENGE fetching failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.CHALLENGE.GET.CURRENT.FAIL",
            message: "All current User CHALLENGE fetching failed",
            error: err
        });
    });
});

//get challenge by id
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
        challengeSchema
        .find({ _id: req.params.id })
        .populate("owner")
        .populate("challenger_contant")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.CHALLENGE.GET.SUCESS",
                message: "challenge fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.CHALLENGE.GET.FAIL",
                message: "CHALLENGE fetching failed",
                error: err
            });
        });
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.CHALLENGE.GET.FAIL",
            message: "CHALLENGE fetching failed",
            error: err
        });
    });
});

//get challenges by owner id
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
        challengeSchema
        .find({ owner_id: req.params.id })
        .populate("owner")
        .populate("challenger_contant")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.CHALLENGES.GET.SUCESS",
                message: "CHALLENGES fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.CHALLENGES.GET.FAIL",
                message: "CHALLENGES fetching failed",
                error: err
            });
        });
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.CHALLENGES.GET.FAIL",
            message: "CHALLENGES fetching failed",
            error: err
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
        challengeSchema
        .find({ _id: req.params.id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.CHALLENGE.DELETE.FAIL",
                    message: "challenge not found",
                });
            }
            challengeContentSchema.deleteOne({_id: result[0].challenger_contant_id }).exec()
            challengeSchema
            .deleteOne({ _id: req.params.id })
            .exec()
            .then(deletingResult => {
                res.status(200).json({
                    code: "API.CHALLENGE.DELETE.SUCESS",
                    message: "CHALLENGE deleted successfully",
                    result: deletingResult
                });
            }
            ).catch(err => {
                res.status(400).json({
                    code: "API.CHALLENGE.DELETE.FAIL",
                    message: "CHALLENGE deletion failed",
                    error: err
                });
            }
            );
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.CHALLENGE.DELETE.FAIL",
                message: "CHALLENGE deletion failed",
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
        challengeSchema
        .findOne({ _id: req.body.challenge_id })
        .exec()
        .then(result => {
            if(result == null){
                return res.status(400).json({
                    code: "API.CHALLENGE.VOTE.ADD.FAIL",
                    message: "CHALLENGE not found"
                });
            }
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.CHALLENGE.VOTE.ADD.FAIL",
                    message: "CHALLENGE not found"
                });
            }
            if(req.body.selected_option == 1){
                challengeContentSchema
                .findOneAndUpdate({ _id: result.challenger_contant_id },  { $inc: { first_option_score: 1 }  
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
                    res.status(200).json({
                        code: "API.CHALLENGE.VOTE.ADD.SUCESS",
                        message: "Vote added successfully",
                        result: voteResult
                    });
                }
                ).catch(err => {
                    res.status(406).json({
                        code: "API.CHALLENGE.VOTE.ADD.FAIL",
                        message: "Vote adding failed",
                        error: err
                    });
                });
            }else{
                challengeContentSchema
                .findOneAndUpdate({ _id: result.challenger_contant_id },  { $inc: { second_option_score: 1 }  , $push: {voters: 
                    {
                        voter_id: resultList[0].user_id,
                        option: 2
                    }
                }})
                .exec()
                .then(voteResult => {
                    res.status(200).json({
                        code: "API.CHALLENGE.VOTE.ADD.SUCESS",
                        message: "Vote added successfully",
                        result: voteResult
                    });
                }
                ).catch(err => {
                    res.status(406).json({
                        code: "API.CHALLENGE.VOTE.ADD.FAIL",
                        message: "Vote adding failed",
                        error: err
                    });
                });
            }
        });
    });
});
module.exports = router;