const express = require("express");
const router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require(__dirname + "../models/users");
const { OtpGen } = require(__dirname + "./generateOTP");


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/verified"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const { id, displayName, emails } = profile;
            // Check if the user exists in the database by their Google ID
            const facebookUser = await User.findOne({ facebookId: profile.id });

            if (facebookUser) {
                // User exists, return the user object
                return cb(null, facebookUser);
            } else {
                // User doesn't exist, create a new user
                const newUser = new User({
                    name: displayName,
                    email: (emails && emails.length > 0) ? emails[0].value : null,
                    verified: false,
                    googleId: null,
                    facebookId: id
                });

                await newUser.save();

                // Return the new user object
                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    }));

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/facebook/verified',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async (req, res) => {
        try {

            if (req.user.verified) {
                const data = {
                    user: {
                        id: req.user._id
                    }
                }
                const authToken = jwt.sign(data, process.env.JWT_SECRET);
                res.json({ "auth-token": authToken });
            }
            else {
                const userId = req.user._id;
                const Otpgen = await OtpGen(userId);
                res.json({ status: "not verified", "otp": Otpgen });
            }
        }
        catch (error) {
            res.status(500).send("Some Error Occured");
            console.log(error);
        }
    });
module.exports = router;