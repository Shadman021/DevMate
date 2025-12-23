const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt= require("jsonwebtoken")

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const {firstName, lastName, emailId, age, password} =req.body;

    // validation of data
    validateSignupData(req);

    //encrypting password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    

    //Creating new instance of user model
    const user = new User({
        firstName,
        lastName,
        emailId,
        age,
        password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully!!!");
  } catch (err) {
    res.status(400).send("Error adding user : " + err.message);
  }
});

authRouter.post("/login", async(req, res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("EmailId not present in DB");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            //creating jwt token...
            const token = await user.getJWT();

            res.cookie("token", token,{ expires: new Date(Date.now()+ 8*360000)});
            res.send(user);
        }else{
            throw new Error("Password is not correct");
        }
    }catch(err){
        res.status(400).send("this Error: "+err.message);
    }
})

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null,{
        expire: new Date(Date.now()),
    });
    res.send("Logout successfull!!")
})

module.exports = authRouter;