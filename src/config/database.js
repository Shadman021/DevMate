const mongoose= require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mohammadshadman543_db_user:r4B928NO4FFKkGSv@cluster0.qbfqrel.mongodb.net/DevMate");
}

module.exports = {connectDB};