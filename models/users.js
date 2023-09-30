const mongoose = require("mongoose");
const findOrCreatePlugin = require("mongoose-findorcreate");
const findOrCreate = require("mongoose-findorcreate");
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
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
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', UserSchema);