require("dotenv").config;
const express = require("express");
const connectToMongo = require("./db");
const User = require("./models/users");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 5000;
connectToMongo();

//ROUTE-1 : Check the api is up and running
app.get("/", (req, res) => {
    res.json({ "STATUS": "app working fine" })
})

// ROUTE-2: Add a new user to the Database
app.use("/createuser", require("./routes/addNewUser"))

// ROUTE-3: Login using Native Email and Password
app.use("/login", require("./routes/login"))

// ROUTE-4: To regenerate the otp and verfiy the account
app.use("/regenerate", require("./routes/regenOTP"));

// ROUTE-5: for Google OAuth.
User.plugin(findOrCreate);
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
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/compose",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        User.findOne({ googleId: profile.id })
            .then((user) => {
                return cb(null, user);
            })
            .catch((err) => {
                return cb(err, null);
            });
    }
));
app.get("/auth/google", passport.authenticate('google', { scope: ["profile"] }));

app.get("/auth/google/verified", passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect("/userProfile");
    }
);

// ROUTE-5: Redirect the user to the UserProfile page after logging in using Google auth
app.get("/userProfile", (req, res) => {
    const token = req.header("auth-token");
    if (token) {
        res.json({ status: "User verified" });
    }
    else {
        res.json({ status: "Please login Using valid Creds" });
    }
})

app.listen(PORT, () => {
    console.log("[STATUS] The server is Running on PORT: " + PORT)
})