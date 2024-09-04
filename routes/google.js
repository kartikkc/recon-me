// Importing Packages
const express = require("express");
const Router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { OtpGen } = require("./generateOTP");
const User = require("../models/users");
const mailer = require("../mailer");
const otp = require("../models/otp");
const { SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
// Setting up BodyParser
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
// Setting up passport and session package
Router.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));
Router.use(passport.initialize());
Router.use(passport.session());


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
    callbackURL: "https://recon-me.vercel.app/googleLogin/auth/google/verified",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: ["profile", "email"]
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const { id, name, email} = profile._json;
            // Check if the user exists in the database by their Google ID
            const googleUser = await User.findOne({ email: email });
            if (googleUser) {
                // User exists, return the user object
                googleUser.googleId = profile.id;
                await googleUser.save();
                return cb(null, googleUser);
            } else {
                // User doesn't exist, create a new user
                const newUser = new User({
                    name: name,
                    email: email,
                    verified: false,
                    googleId: id,
                    facebookId: null
                });
                await newUser.save().then(
                console.log("[Status] New User Saved")
                ).catch(error => console.error(error));

                // Return the new user object
                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    }
));
Router.get("/auth/google", passport.authenticate('google', { scope: ["profile", "email"] }));

Router.get("/auth/google/verified", passport.authenticate('google', { failureRedirect: '/signup' }),
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
                const { name, email } = req.user;
                const Otpgen = await OtpGen(userId);
                await mailer(Otpgen, name, email);   
                res.json({
                    status: "not verified",
                    "name": name,
                    "email": email,
                    googleId: googleId,
                    "Message": "Otp Sent Successfully"
                });
            }
        }
        catch (error) {
            res.status(500).send("Some Error Occured");
            console.log(error);
        }
    }
);

module.exports = Router;
