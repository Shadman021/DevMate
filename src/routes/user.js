const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const userSafeData = "firstName lastName photoUrl age gender about skills";

//get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", userSafeData)

        res.json({
            message: "data fetched successfully",
            data: connectionRequests,
        })

    }catch(err){
        res.status(400).json({message: "Error : " +err.message})
    }
})

userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequests=await ConnectionRequest.find({
            $or:[
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserid: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", userSafeData)
        .populate("toUserId", userSafeData);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        })

        res.json({ data })
    }catch(err){
        res.status(400).send("ERROR: " +err.message);
    }
})

userRouter.get("/feed", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        console.log(hideUsersFromFeed);
        
        const users = await User.find({
            $and: [
                {_id:{$nin: Array.from(hideUsersFromFeed)}}, { _id: {$ne: loggedInUser._id}}
            ],
        });

        res.send(users)
    }catch(err){
        res.status(400).send("ERROR: " +err.message);
    }
})

module.exports = userRouter;