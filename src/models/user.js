const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 4
    },
    lastName:{
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: "+value);
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 16
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data not valid...");
            }
        }
    },
    photoUrl:{
        type: String,
        default: "http://vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Please enter a valid URL");
            }
        }
    },
    about:{
        type: String,
        default: "This is a default about the use..."
    },
    skills:{
        type: [String],
    },
},
    {
        timestamps: true,
    }
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@MATE$790", {expiresIn: "7d"});
    return token;
}

module.exports = mongoose.model("User", userSchema);