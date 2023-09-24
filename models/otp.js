const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        defualt: Date.now()
    },
    expiry: {
        type: Date,
        defualt: Date.now() + 360000
    }
})

module.exports = mongoose.model("Otp", otpSchema);