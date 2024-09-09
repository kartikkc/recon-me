const mongoose = require("mongoose");
const findOrCreatePlugin = require("mongoose-findorcreate");
const findOrCreate = require("mongoose-findorcreate");
const { Schema } = mongoose;
const UserSchema = new Schema({
    fname: {
        type: String,
        // required: true
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
        required: true
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', UserSchema);