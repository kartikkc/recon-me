const express = require("express");
const Router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { OtpGen } = require(__dirname + "./generateOTP");
const User = require(__dirname + "../models/users");
const { SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
Router.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));
Router.use(passport.initialize());
Router.use(passport.session());
Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));


passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            userId: user.id,
            name: user.username,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/verified",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const { id, displayName, emails } = profile;
            // Check if the user exists in the database by their Google ID
            const googleUser = await User.findOne({ googleId: profile.id });

            if (googleUser) {
                // User exists, return the user object
                return cb(null, googleUser);
            } else {
                // User doesn't exist, create a new user
                const newUser = new User({
                    name: displayName,
                    email: (emails && emails.length > 0) ? emails[0].value : null,
                    verified: false,
                    googleId: id,
                    facebookId: null
                });

                await newUser.save();

                // Return the new user object
                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    }
));
Router.get("/auth/google", passport.authenticate('google', { scope: ["profile"] }));

Router.get("/auth/google/verified", passport.authenticate('google', { failureRedirect: '/' }),
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
    }
);

module.exports = Router;