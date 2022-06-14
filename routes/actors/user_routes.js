const express = require("express");
const userSchema = require("../../schemas/actors/user_schema");
const tokenSchema = require("../../schemas/token_schema");
const authSchema = require("../../schemas/auth_schema");
const mongoose = require("mongoose");
const utils = require("../../utils/util_methods");
const constants = require("../../utils/constants");
const bcrypt = require("bcryptjs");
//const databaseSchema = require("../../schemas/objects/class_schema");

const router = express.Router();

//Get all users details
router.post("/retrieve/all", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      userSchema.find(function (err, users) {
        if (err) {
          console.log(err);
        } else {
            return res.status(200).json({
                code: "API.USER.FETCH_ALL_SUCCESS",
                message: "Users fetched successfully",
                data: users
            });
        }
      });
    });
});

//Retirieve user by id
router.post("/retrieve/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      let id = req.params.id;
      userSchema
        .find({ _id: id })
        .exec()
        .then((userList) => {
          if (userList.length < 1) {
            return res.status(404).json({
              code: "API.USER.NOT_FOUND",
              message: "ID not found!",
            });
          }
          if (userList) {
            return res.status(200).json({
                code: "API.USER.FOUND",
                message: "Featched user successfully",
                data: userList[0]
            });
          }
        });
    });
});

//Retirieve current user
router.get("/retrieve", utils.extractToken, (req, res) => {
    tokenSchema
      .find({ token: req.token })
      .exec()
      .then((resultList) => {
        if (resultList.length < 1) {
          return res.status(401).json({
            message: "Invalid Token",
          });
        }else{
            let id = resultList[0].user_id;
            userSchema
            .find({ _id: id })
            .exec()
            .then((userList) => {
                if (userList.length < 1) {
                return res.status(401).json({
                    code: "API.USER.NOT_FOUND",
                    message: "ID not found!",
                });
                }
                if (userList) {
                    return res.status(200).json({
                        code: "API.USER.FEATCHED",
                        message: "Featched user successfully",
                        data: userList[0]
                    });
                }
            });
       
        }
    });
});

// Retrieve user list by them IDs
router.post("/retrieveList", utils.extractToken, (req, res) => {
    tokenSchema
        .find({ token: req.token })
        .exec()
        .then((resultList) => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token",
                });
            }
            // let id = req.params.id;
            try {
              userSchema
                .find({ _id : { $in : req.body.list } })
                .exec()
                .then((resultList) => {
                    if (resultList.length < 1) {
                        return res.status(404).json({
                            code: "API.USERLIST.NOT_FOUND",
                            message: "ID not found!",
                        });
                    }
                    if (resultList) {
                        return res.status(200).json({
                            code: "API.USERLIST.FOUND",
                            message: "Featched users successfully",
                            data: resultList
                        });
                    }
                });
            } catch (error) {
              return res.status(401).json({
                code: "API.USERLIST.NOT_FOUND",
                message: "Invalid Id list",
              });
            }

        });
});

//Add new student
router.post("/register/student", (req, res) => {
  authSchema.find({email: req.body.email},
    function (err, account) {
      if (account.length >= 1) {
        res.status(409).send({
          code: "API.EMAIL_EXIST",
          message: "email already used use another one",
        });
      } else {
        if(req.body.password == null){
            res.status(405).send({
              code: 'API.MISSING_PASSWORD',
              message: "password required",
            });
        }else{
                const hash = bcrypt.hashSync(req.body.password, 8);
                const newObjectID = mongoose.Types.ObjectId();
                const userModel = new userSchema({
                  _id: newObjectID,
                  username: req.body.username,
                  email: req.body.email,
                  name: req.body.name,
                  surname: req.body.surname,
                  gender: req.body.gender,
                  dob: req.body.dob,
                  phone: req.body.phone,
                  reg_date: new Date(),
                  profile_img: req.body.profile_img,
                  is_student: true
                });
                userModel.save().then((data) =>{
                  const authModel = new authSchema({
                    user_id: data._id,
                    email: data.email,
                    username: data.username,
                    role: constants.USER_TYPE_STUDENT,
                    password_hash: hash
                  });
                  authModel.save().then((auth)=>{
                    res.status(201).json({
                      code: 'API.CREATED_NEW_STUDENT',
                      data: data
                    });
                  })
                }).catch((err) => {
                    res.status(500).json({
                        code: "API.ERROR_CREATING_STUDENT",
                        error: err,
                    });
                });
            }
        }
    }
  );
});

//Add new guest
router.post("/register/guest", (req, res) => {
    authSchema.find({email: req.body.email},
      function (err, account) {
        if (account.length >= 1) {
          res.status(409).send({
            code: "API.EMAIL_EXIST",
            message: "email already used use another one",
          });
        } else {
          if(req.body.password == null){
              res.status(405).send({
                code: 'API.MISSING_PASSWORD',
                message: "password required",
              });
          }else{
                  const hash = bcrypt.hashSync(req.body.password, 8);
                  const newObjectID = mongoose.Types.ObjectId();
                  const userModel = new userSchema({
                    _id: newObjectID,
                    username: req.body.username,
                    email: req.body.email,
                    name: req.body.name,
                    surname: req.body.surname,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    phone: req.body.phone,
                    reg_date: new Date(),
                    profile_img: req.body.profile_img,
                    is_student: false
                  });
                  userModel.save().then((data) =>{
                    const authModel = new authSchema({
                      user_id: data._id,
                      email: data.email,
                      username: data.username,
                      role: constants.USER_TYPE_GUEST,
                      password_hash: hash
                    });
                    authModel.save().then((auth)=>{
                      res.status(201).json({
                        code: 'API.CREATED_NEW_GUEST',
                        data: data
                      });
                    })
                  }).catch((err) => {
                      res.status(500).json({
                          code: "API.ERROR_CREATING_GUEST",
                          error: err,
                      });
                  });
              }
          }
      }
    );
});

//convert guest to student
router.get("/student/set", utils.extractToken, (req, res) => {
    //get user id from token
    tokenSchema
      .find({ token: req.token })
      .exec()
      .then((resultList) => {
        if (resultList.length < 1) {
          return res.status(401).json({
            message: "Invalid Token",
          });
        }else{
        userSchema
          .updateOne({ _id: resultList[0].user_id }, { $set: { is_student: true } })
          .then((result) => {
            userSchema
            .find({ _id: resultList[0].user_id })
            .exec()
            .then((userList) => {
                res.status(200).json({
                  code: "API.CONVERTED_USER_TO_STUDENT",
                  message: "successfully converted user to student",
                  data: userList[0]
                });
              })
          })
          .catch((err) => {
            res.status(400).json({
              code: "API.ERROR_CONVERTING_USER_TO_STUDENT",
              message: "Updating role failed",
              error: err,
          });
        });
    }});
});

//Update the user details
router.post("/update", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }else{
        userSchema
          .updateOne({ _id: resultList[0].user_id }, { $set: {
            username: req.body.username,
            //email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            gender: req.body.gender,
            dob: req.body.dob,
            profile_img: req.body.profile_img
        }}).then((result) => {
            userSchema.find({ _id: req.params.id })
            .exec().then((userList) => {
                res.status(200).json({
                  code: "API.UPDATED_STUDENT",
                  message: "Updated successfully",
                  data: userList[0]
                });
            }).catch((err) => {
                res.status(400).json({
                  code: "API.ERROR_UPDATING_STUDENT",
                  message: "Updating failed",
                  error: err,
              });
            });
        });
    }});
});

// Delete the user
router.delete("/delete/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      userSchema.findOneAndDelete({ _id: req.params.id }).then((result) => {
        if(result == null || result == undefined || result.length == 0){
            res.status(404).json({
                code: "API.USER_NOT_FOUND",
                message: "User not found",
                error: "User not found"
            });
        }else{
            userSchema.findOneAndDelete({ _id: req.params.id }, function (err) {
                if (err) {
                    res.status(405).json({
                        code: "API.ERROR_DELETING_USER",
                        message: "Deleting user failed",
                        error: err,
                    });
                }
                else {
                    authSchema.findOneAndDelete({ user_id: req.params.id }, function (err) {
                        if (err){
                            res.status(405).json({
                                code: "API.ERROR_DELETING_USER",
                                message: "Deleting user failed",
                                error: err,
                            });
                        }
                        else {
                            res.status(200).json({
                                code: "API.DELETED_USER",
                                message: "User deleted successfully"
                            });
                    }
                })
            };
        });
    }});
})
});

router.post("/find", (req, res) => {
  var name = req.body.name;
  var query = {};
  query[name] = { $regex: req.body.value };
  studentSchema
    .find({ _id: req.params.id })
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
});

router.post("/affect/class", (req, res) => {
  databaseSchema
  .find({ _id: req.body.class_id })
  .exec()
  .then((resultList) => {
    if (resultList.length < 1) {
      return res.status(401).json({
        message: "class Id not found",
      });
    }
    if (resultList) {
      studentSchema
        .updateOne({ _id: req.body.student_id }, {
          "$set": {
            "class_id": req.body.class_id,
            "class": req.body.class_id
          }
        })
        .then((result) => {
          studentSchema
          .find({ _id: req.body.student_id })
          .populate('class')
          .exec()
          .then((studentList) => {
              res.status(200).json({
                message: "Successfully affect class",
                createdStudent: result,
                student: studentList[0]
              });
            })
          })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
        });
      });
    }
  })
});

router.post("/retrieveclass", utils.extractToken, (req, res) => {
  databaseSchema
  .find({ _id: req.body.class_id })
  .exec()
  .then((data) => {
    if (data.length < 1) {
      return res.status(401).json({
        message: "class Id not found",
      });
    }
    if (data) {
      studentSchema
        .find({ class_id : req.body.class_id })
        .exec()
        .then((resultList) => {
            if (resultList.length < 1) {
                return res.status(200).json({
                    message: "No student affected to that class",
                });
            }
            if (resultList) {
                res.status(200).json({students: resultList});
            }
        });
      }
    });
});

module.exports = router;
