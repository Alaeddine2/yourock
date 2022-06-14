const express = require("express");
const userSchema = require("../../schemas/actors/user_schema");
const postSchema = require("../../schemas/object/post_schema");
const mongoose = require("mongoose");
const utils = require("../../utils/util_methods");
const constants = require("../../utils/constants");
const tokenSchema = require("../../schemas/token_schema");
const commentSchema = require("../../schemas/object/comment_schema");

const router = express.Router();

//add new post
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
        const postModel = new postSchema({
            title: req.body.title,
            post_nature: req.body.post_nature,
            post_url: req.body.post_url,
            last_update: Date.now(),
            owner: req.body.owner_id,
            owner_id: req.body.owner_id
        });
        postModel.save().then(result => {
            res.status(200).json({
                code: "API.POST.SUCESS",
                message: "Post added successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.FAIL",
                message: "Post adding failed",
                error: err
            });
        });
    });
});

//get all posts
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
        postSchema
        .find({})
        .populate("owner")
        .sort({ creating_date: 1 })
        .skip(req.body.skip)
        .limit(req.body.limit)
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POST.GET.SUCESS",
                message: "All posts fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.GET.FAIL",
                message: "All posts fetching failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.POST.GET.FAIL",
            message: "All posts fetching failed",
            error: err
        });
    });
});

//get all posts of current user
router.get("/me", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .sort({ creating_date: 1 })
    .skip(req.body.skip)
    .limit(req.body.limit)
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        postSchema
        .find({owner_id: resultList[0].user_id})
        .populate("owner")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POST.GET.SUCESS",
                message: "All posts fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.GET.FAIL",
                message: "All posts fetching failed",
                error: err
            });
        }
        );
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.POST.GET.FAIL",
            message: "All posts fetching failed",
            error: err
        });
    });
});

//get post by id
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
        postSchema
        .find({ _id: req.params.id })
        .populate("owner")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POST.GET.SUCESS",
                message: "Post fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.GET.FAIL",
                message: "Post fetching failed",
                error: err
            });
        });
    }
    ).catch(err => {
        res.status(400).json({
            code: "API.POST.GET.FAIL",
            message: "Post fetching failed",
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
        postSchema
        .findOneAndUpdate({ _id: req.body.id }, { $set: { title: req.body.title, post_nature: req.body.post_nature, post_url: req.body.post_url, last_update: Date.now() } }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POST.UPDATE.SUCESS",
                message: "Post updated successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.UPDATE.FAIL",
                message: "Post updating failed",
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
        postSchema
        .find({ _id: req.params.id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POST.DELETE.FAIL",
                    message: "Post not found",
                });
            }
            postSchema
            .deleteOne({ _id: req.params.id })
            .exec()
            .then(deletingResult => {
                res.status(200).json({
                    code: "API.POST.DELETE.SUCESS",
                    message: "Post deleted successfully",
                    result: deletingResult
                });
            }
            ).catch(err => {
                res.status(400).json({
                    code: "API.POST.DELETE.FAIL",
                    message: "Post deletion failed",
                    error: err
                });
            }
            );
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.DELETE.FAIL",
                message: "Post deletion failed",
                error: err
            });
        }
        );
    });
});

//adding new comment to post
router.post("/comment/add", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        postSchema
        .findOne({ _id: req.body.post_id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POST.COMMENT.ADD.FAIL",
                    message: "Post not found",
                });
            }
            const commentModel = new commentSchema({
                post_id: req.body.post_id,
                post: req.body.post_id,
                text: req.body.comment_text,
                owner_id: resultList[0].user_id,
                owner: resultList[0].user_id
            });
            commentModel
            .save().then(commentResult => {
                res.status(200).json({
                    code: "API.POST.COMMENT.ADD.SUCESS",
                    message: "Comment added successfully",
                    result: commentResult
                });
            }
            ).catch(err => {
                res.status(406).json({
                    code: "API.POST.COMMENT.ADD.FAIL",
                    message: "Comment adding failed",
                    error: err
                });
            }
            );
        });
    });
});

//get all comments of post
router.get("/comment/:id", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        postSchema
        .find({ _id: req.params.id })
        .populate("owner")
        .exec()
        .then(result => {
            res.status(200).json({
                code: "API.POST.COMMENT.GET.SUCESS",
                message: "Comment fetched successfully",
                result: result
            });
        }
        ).catch(err => {
            res.status(400).json({
                code: "API.POST.COMMENT.GET.FAIL",
                message: "Comment fetching failed",
                error: err
            });
        }
        );
    });
});

//delete comment by id
router.delete("/comment/:id", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        commentSchema
        .find({ _id: req.params.id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POST.COMMENT.DELETE.FAIL",
                    message: "Comment not found",
                });
            }
            commentSchema
            .deleteOne({ _id: req.params.id })
            .exec()
            .then(deletingResult => {
                res.status(200).json({
                    code: "API.POST.COMMENT.DELETE.SUCESS",
                    message: "Comment deleted successfully",
                    result: deletingResult
                });
            }
            ).catch(err => {
                res.status(400).json({
                    code: "API.POST.COMMENT.DELETE.FAIL",
                    message: "Comment deletion failed",
                    error: err
                });
            }
            );
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
        postSchema
        .findOne({ _id: req.body.post_id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POST.VOTE.ADD.FAIL",
                    message: "Post not found"
                });
            }
            postSchema
            .findOneAndUpdate({ _id: req.body.post_id },  { $inc: { votes: 1 }  , $push: {voters: resultList[0].user_id}})
            .exec()
            .then(voteResult => {
                res.status(200).json({
                    code: "API.POST.VOTE.ADD.SUCESS",
                    message: "Vote added successfully",
                    result: voteResult
                });
            }
            ).catch(err => {
                res.status(406).json({
                    code: "API.POST.VOTE.ADD.FAIL",
                    message: "Vote adding failed",
                    error: err
                });
            });
        });
    });
});


//unvote for post
router.post("/unvote", utils.extractToken, (req, res) => {
    tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
        if (resultList.length < 1) {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }
        postSchema
        .findOne({ _id: req.body.post_id })
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(400).json({
                    code: "API.POST.UNVOTE.ADD.FAIL",
                    message: "Post not found",
                });
            }
            postSchema
            .findOneAndUpdate({ _id: req.body.post_id },  { $inc: { votes: -1 }  , $pull: {voters: resultList[0].user_id}})
            .exec()
            .then(voteResult => {
                res.status(200).json({
                    code: "API.POST.UNVOTE.ADD.SUCESS",
                    message: "Vote added successfully",
                    result: voteResult
                });
            }
            ).catch(err => {
                res.status(406).json({
                    code: "API.POST.UNVOTE.ADD.FAIL",
                    message: "Vote adding failed",
                    error: err
                });
            });
        });
    });
});

module.exports = router;