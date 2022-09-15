const cron = require('node-cron');
const challengeSchema = require("../schemas/object/challenge_schema");
const notificationSchema = require("../schemas/object/notification_schema");

module.exports = {
    startCron:
    function(){
        cron.schedule('* * * * *', function() {
            challengeSchema.find({end_challenge_date: {
                $lte: Date.now()
            }, is_activate: true, is_completed: false}).then(result => {
                result.forEach(res =>{
                    if(res.is_started){
                        //notify creator
                        const notificationModel = new notificationSchema({
                            post_id: null,
                            post: null,
                            action_type: 3,
                            actuator: res.challenger_id,
                            actuator_id: res.challenger_id,
                            notification_type: 2,
                            owner_id: res.owner_id,
                            owner: res.owner_id,
                            comment_id: null,
                            poll_id: null,
                            creating_date: Date.now(),
                            challenge: res.challenger_id,
                            challenge_id: res.challenger_id
                        });
                        notificationModel.save();
                        //notify challenger
                        const notificationModel2 = new notificationSchema({
                            post_id: null,
                            post: null,
                            action_type: 1,
                            actuator: res.owner_id,
                            actuator_id: res.owner_id,
                            notification_type: 2,
                            owner_id: res.challenger_id,
                            owner: res.challenger_id,
                            comment_id: null,
                            poll_id: null,
                            creating_date: Date.now(),
                            challenge: res.owner_id,
                            challenge_id: res.owner_id
                        });
                        notificationModel2.save();
                        //update challenge
                        challengeSchema.updateOne({_id: res._id}, {$set: {is_completed: true, is_activate: false}}).then(result => {
                           // console.log(result);
                        }).catch(err => {
                            console.log(err);
                        });
                    }else{
                        //notify creator
                        const notificationModel = new notificationSchema({
                            post_id: null,
                            post: null,
                            action_type: 1,
                            actuator: res.challenger_id,
                            actuator_id: res.challenger_id,
                            notification_type: 2,
                            owner_id: res.owner_id,
                            owner: res.owner_id,
                            comment_id: null,
                            poll_id: null,
                            creating_date: Date.now(),
                            challenge: res.challenger_id,
                            challenge_id: res.challenger_id
                        });
                        notificationModel.save();
                        challengeSchema.findByIdAndUpdate({ _id: res._id }, { $set: { is_activate: false, current_status: 1, last_update: Date.now() } }, { new: true }).exec()
                    }
                });
            });
        });
    }
}
