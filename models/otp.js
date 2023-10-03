const mongoose = require("mongoose");
const User = require(__dirname + "./users");
const { Schema } = mongoose;

const otpSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    expiry: {
        type: Date,
        default: Date.now() + 3600000,
    }
})

module.exports = mongoose.model("Otp", otpSchema);